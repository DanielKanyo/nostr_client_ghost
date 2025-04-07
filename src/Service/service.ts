import { nip19, SimplePool, finalizeEvent, verifyEvent, type Event as NostrEvent } from "nostr-tools";

import { hexToBytes } from "@noble/hashes/utils";

export interface UserMetadata {
    name?: string;
    display_name?: string;
    picture?: string;
    about?: string;
    [key: string]: any;
}

// Common Nostr relays
const relays = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net/"];

export const authenticate = async (privateKey: string, pool: SimplePool): Promise<string> => {
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

        localStorage.setItem("nostrPrivateKey", privateKey);
        localStorage.setItem("nostrPublicKey", signedEvent.pubkey);

        pool.close(relays);

        return signedEvent.pubkey;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Authentication failed...");
    }
};

export const fetchUserMetadata = async (publicKey: string, pool: SimplePool): Promise<UserMetadata | null> => {
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
