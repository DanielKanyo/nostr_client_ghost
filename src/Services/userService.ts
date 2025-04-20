import { finalizeEvent, generateSecretKey, getPublicKey, nip19, SimplePool, verifyEvent, type Event as NostrEvent } from "nostr-tools";
import { DecodeResult } from "nostr-tools/nip19";

import { convertPrivateKeyToPrivateKeyBytes, RELAYS } from "../Shared/utils";
import { UserMetadata } from "../Types/userMetadata";

export const authenticateUser = async (privateKey: string): Promise<string> => {
    try {
        const privateKeyBytes = convertPrivateKeyToPrivateKeyBytes(privateKey);
        const pubkey = getPublicKey(privateKeyBytes);
        const testEvent = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: "auth-check",
            pubkey, // required for finalizeEvent
        };
        const signedEvent = finalizeEvent(testEvent, privateKeyBytes);

        if (!verifyEvent(signedEvent)) {
            throw new Error("Failed to validate signed event...");
        }

        return pubkey;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Authentication failed! Please try again later...");
    }
};

export const fetchUserMetadata = async (pool: SimplePool, publicKey: string): Promise<UserMetadata | null> => {
    try {
        const events = await pool.querySync(RELAYS, {
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
            const metadata = JSON.parse(latestEvent.content);

            return { pubkey: latestEvent.pubkey, ...metadata };
        }

        return null;
    } catch (err) {
        throw new Error("Failed to fetch metadata...");
    }
};

export const fetchMultipleUserMetadata = async (pool: SimplePool, publicKeys: string[]): Promise<Map<string, UserMetadata>> => {
    const events = await pool.querySync(RELAYS, {
        kinds: [0],
        authors: publicKeys,
    });

    const metadataMap = new Map<string, UserMetadata>();

    events.forEach((event) => {
        try {
            const metadata = JSON.parse(event.content);
            const existing = metadataMap.get(event.pubkey);

            if (!existing || (existing.created_at && event.created_at > existing.created_at)) {
                metadataMap.set(event.pubkey, {
                    pubkey: event.pubkey,
                    ...metadata,
                    created_at: event.created_at,
                });
            }
        } catch (parseError) {
            console.error(`Failed to parse metadata for ${event.pubkey}:`, parseError);
        }
    });

    return metadataMap;
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
        const pubs = pool.publish(RELAYS, signedEvent);

        await Promise.all(pubs);
    } catch (error) {
        throw new Error("Failed to publish profile...");
    }
};

export const getFollowing = async (pool: SimplePool, pubkey: string): Promise<string[]> => {
    const events = await pool.querySync(RELAYS, {
        kinds: [3],
        authors: [pubkey],
    });

    const latest = events.sort((a, b) => b.created_at - a.created_at)[0];
    if (!latest) return [];

    return latest.tags.filter(([tag]) => tag === "p").map(([, followedPubkey]) => followedPubkey);
};

export const getFollowers = async (pool: SimplePool, pubkey: string): Promise<string[]> => {
    const events = await pool.querySync(RELAYS, {
        kinds: [3],
        "#p": [pubkey],
    });

    const followers = new Set<string>();
    for (const event of events) {
        followers.add(event.pubkey);
    }

    return Array.from(followers);
};

export const encodeNProfile = (pubkey: string): string => nip19.nprofileEncode({ pubkey, relays: RELAYS });
export const decodeNProfileOrNPub = (key: string | undefined) => {
    if (!key) return null;

    try {
        const decoded = nip19.decode(key);

        if (decoded.type === "npub") {
            return { pubkey: decoded.data, relays: [] }; // npub only provides pubkey
        } else if (decoded.type === "nprofile") {
            return { pubkey: decoded.data.pubkey, relays: decoded.data.relays || [] };
        }

        return null; // Invalid type
    } catch (error) {
        console.error("Failed to decode key:", error);
        return null;
    }
};
export const encodeNPub = (pubkey: string): string => nip19.npubEncode(pubkey);
export const decodeNPub = (npub: string): DecodeResult => nip19.decode(npub);

export const updateFollowList = async (pool: SimplePool, privateKey: string, newFollowing: string[]): Promise<void> => {
    const { type, data: sk } = nip19.decode(privateKey);

    if (type !== "nsec") {
        throw new Error("Invalid private key format...");
    }

    const pubkey = getPublicKey(sk);

    const event = {
        kind: 3,
        created_at: Math.floor(Date.now() / 1000),
        tags: newFollowing.map((pk) => ["p", pk]),
        content: "",
        pubkey,
    };

    const signed = finalizeEvent(event, sk);

    try {
        const pubs = pool.publish(RELAYS, signed);
        await Promise.all(pubs);
    } catch {
        throw new Error("Failed to update follow list...");
    }
};

export const closePool = (pool: SimplePool): void => {
    try {
        return pool.close(RELAYS);
    } catch (error) {
        throw new Error("Failed to close pool...");
    }
};
