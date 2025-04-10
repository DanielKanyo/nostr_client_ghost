import { nip19, SimplePool, finalizeEvent, verifyEvent, type Event as NostrEvent, generateSecretKey, getPublicKey } from "nostr-tools";

import { hexToBytes } from "@noble/hashes/utils";

import { UserMetadata } from "../Types/userMetadata";

// Common Nostr relays
const relays = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net/"];

export const authenticateUser = async (privateKey: string): Promise<string> => {
    try {
        let privateKeyBytes: Uint8Array;

        if (privateKey.startsWith("nsec")) {
            try {
                const decoded = nip19.decode(privateKey);
                if (decoded.type !== "nsec") {
                    throw new Error("Invalid nsec format...");
                }
                privateKeyBytes = decoded.data as Uint8Array;
            } catch {
                throw new Error("Invalid nsec key...");
            }
        } else {
            // Validate hex format first
            if (!privateKey.match(/^[0-9a-fA-F]{64}$/)) {
                throw new Error("Invalid private key format. Must be 64 hexadecimal characters...");
            }

            privateKeyBytes = hexToBytes(privateKey);
        }

        const testEvent = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: "Test authentication event",
        };

        const signedEvent = finalizeEvent(testEvent, privateKeyBytes);

        if (!verifyEvent(signedEvent)) {
            throw new Error("Failed to validate signed event...");
        }

        return signedEvent.pubkey;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Authentication failed! Please try again later...");
    }
};

export const fetchUserMetadata = async (pool: SimplePool, publicKey: string): Promise<UserMetadata | null> => {
    try {
        const events = await pool.querySync(relays, {
            kinds: [0], // Metadata events
            authors: [publicKey],
        });

        // Find the most recent metadata event
        const latestEvent = events.reduce((latest: NostrEvent | null, current: NostrEvent) => {
            if (!latest || current.created_at > latest.created_at) {
                return current;
            }
            return latest;
        }, null);

        if (latestEvent) {
            const meta = JSON.parse(latestEvent.content) as UserMetadata;

            return meta;
        }

        return null;
    } catch (err) {
        throw new Error("Failed to fetch metadata...");
    }
};

export const generateKeyPair = (): { privateKey: string; publicKey: string } => {
    const sk = generateSecretKey();
    const pk = getPublicKey(sk);

    const nsec = nip19.nsecEncode(sk);
    const npub = nip19.npubEncode(pk);

    return { privateKey: nsec, publicKey: npub };
};

export const publishProfile = async (pool: SimplePool, privateKey: string, userMetadata: UserMetadata): Promise<void> => {
    // Decode nsec private key to raw form
    const { type, data: sk } = nip19.decode(privateKey);

    if (type !== "nsec") {
        throw new Error("Invalid private key format...");
    }

    // Create a kind 0 metadata event
    const eventTemplate = {
        kind: 0,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify({
            name: userMetadata.name,
            display_name: userMetadata.display_name,
            picture: userMetadata.picture,
            banner: userMetadata.banner,
            about: userMetadata.about,
            website: userMetadata.website,
        }),
    };

    // Sign the event
    const signedEvent = finalizeEvent(eventTemplate, sk);

    try {
        const pubs = pool.publish(relays, signedEvent);

        await Promise.all(pubs);
    } catch (error) {
        throw new Error("Failed to publish profile...");
    }
};

export const getFollowing = async (pool: SimplePool, pubkey: string): Promise<string[]> => {
    const events = await pool.querySync(relays, {
        kinds: [3],
        authors: [pubkey],
    });

    const latest = events.sort((a, b) => b.created_at - a.created_at)[0];
    if (!latest) return [];

    return latest.tags.filter(([tag]) => tag === "p").map(([, followedPubkey]) => followedPubkey);
};

export const getFollowers = async (pool: SimplePool, pubkey: string): Promise<string[]> => {
    const events = await pool.querySync(relays, {
        kinds: [3],
        "#p": [pubkey],
    });

    const followers = new Set<string>();
    for (const event of events) {
        followers.add(event.pubkey);
    }

    return Array.from(followers);
};

export const closePool = (pool: SimplePool): void => {
    try {
        return pool.close(relays);
    } catch (error) {
        throw new Error("Failed to close pool...");
    }
};
