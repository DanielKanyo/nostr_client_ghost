import { nip19 } from "nostr-tools";

import { hexToBytes } from "@noble/hashes/utils";

export const DEFAULT_MAIN_CONTAINER_WIDTH = 680;
export const DEFAULT_SIDE_CONTAINER_WIDTH = 320;
export const HIDE_ALERT_TIMEOUT_IN_MS = 6000;
export const DEFAULT_NUM_OF_DISPLAYED_ITEMS = 20;

export enum PROFILE_CONTENT_TABS {
    NOTES = "notes",
    REPLIES = "replies",
    FOLLOWERS = "followers",
    FOLLOWING = "following",
}

// Common Nostr relays
export const RELAYS = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net/"];

export enum NoteFilterOptions {
    Notes = "Notes",
    Replies = "Replies",
    All = "All",
}

export const convertPrivateKeyToPrivateKeyBytes = (privateKey: string): Uint8Array => {
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

    return privateKeyBytes;
};

export const isHexPubkey = (input: string): boolean => {
    return /^[a-fA-F0-9]{64}$/.test(input);
};

const MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

export const formatTimestamp = (timestamp: number): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();

    // Check if less than 1 hour (60 minutes)
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    }

    // Check if less than 24 hours
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
        return `${diffHours}h`;
    }

    // Check if same year
    const isSameYear = now.getFullYear() === date.getFullYear();
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();

    if (isSameYear) {
        return `${month} ${day}`;
    } else {
        const year = date.getFullYear();
        return `${year}, ${month} ${day}`;
    }
};
