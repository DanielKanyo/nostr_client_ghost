import { NostrEvent, SimplePool } from "nostr-tools";

import { RELAYS } from "../Shared/utils";

export const fetchNotes = async (pool: SimplePool, pubkeys: string[], limit: number = 20, until?: number): Promise<NostrEvent[]> => {
    if (!pubkeys.length) return [];

    const filter = {
        kinds: [1],
        authors: pubkeys,
        limit,
        ...(until && { until }),
    };

    try {
        const notes = await pool.querySync(RELAYS, filter);

        return notes.sort((a, b) => b.created_at - a.created_at);
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        return [];
    }
};
