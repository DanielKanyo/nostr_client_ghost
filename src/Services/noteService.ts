import { NostrEvent, SimplePool } from "nostr-tools";

import { NoteFilterOptions, RELAYS } from "../Shared/utils";

export const fetchNotes = async (
    pool: SimplePool,
    pubkeys: string[],
    limit: number = 20,
    filterOptions: NoteFilterOptions = NoteFilterOptions.All,
    until?: number
): Promise<NostrEvent[]> => {
    if (!pubkeys.length) return [];

    const filter = {
        kinds: [1],
        authors: pubkeys,
        limit,
        ...(until && { until }),
    };

    try {
        const notes = await pool.querySync(RELAYS, filter);

        // Apply filtering based on filterOptions
        let filteredNotes: NostrEvent[];

        switch (filterOptions) {
            case NoteFilterOptions.Posts:
                // Exclude replies (notes with #e tags)
                filteredNotes = notes.filter((note) => note.tags.every((tag) => tag[0] !== "e"));
                break;
            case NoteFilterOptions.Replies:
                // Include only replies (notes with #e tags)
                filteredNotes = notes.filter((note) => note.tags.some((tag) => tag[0] === "e"));
                break;
            case NoteFilterOptions.All:
            default:
                // Include all notes
                filteredNotes = notes;
                break;
        }

        return filteredNotes.sort((a, b) => b.created_at - a.created_at);
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        return [];
    }
};
