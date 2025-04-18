import { nip19, NostrEvent, SimplePool } from "nostr-tools";

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
            case NoteFilterOptions.Notes:
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

export const encodeNEvent = (id: string) => nip19.neventEncode({ id, relays: RELAYS });
export const decodeNEvent = (nprofile: string): { id: string; relays?: string[] } => {
    const decoded = nip19.decode(nprofile);

    if (decoded.type !== "nevent") {
        throw new Error("Invalid nevent");
    }

    return decoded.data;
};

// export const fetchBookmarkedNotes = async (
//     pool: SimplePool,
//     pubkey: string,
//     limit: number = 20,
//     filterOptions: NoteFilterOptions = NoteFilterOptions.All,
//     until?: number
// ): Promise<NostrEvent[]> => {
//     try {
//         // Step 1: Fetch bookmark events (kind 10003) for the user
//         const bookmarkFilter = {
//             kinds: [10003],
//             authors: [pubkey],
//             limit: limit * 2, // Fetch more to account for potential invalid tags
//             ...(until && { until }),
//         };

//         const bookmarkEvents = await pool.querySync(RELAYS, bookmarkFilter);

//         // Extract note IDs from #e tags
//         const noteIds = bookmarkEvents
//             .flatMap((event) => event.tags)
//             .filter((tag) => tag[0] === "e" && tag[1]) // Ensure valid #e tags
//             .map((tag) => tag[1]); // Get the note ID

//         if (!noteIds.length) return [];

//         // Step 2: Fetch the bookmarked notes (kind 1) using the note IDs
//         const noteFilter = {
//             kinds: [1],
//             ids: noteIds.slice(0, limit), // Limit to avoid excessive queries
//             ...(until && { until }),
//         };

//         const notes = await pool.querySync(RELAYS, noteFilter);

//         // Apply filtering based on filterOptions
//         let filteredNotes: NostrEvent[];

//         switch (filterOptions) {
//             case NoteFilterOptions.Posts:
//                 // Exclude replies (notes with #e tags)
//                 filteredNotes = notes.filter((note) => note.tags.every((tag) => tag[0] !== "e"));
//                 break;
//             case NoteFilterOptions.Replies:
//                 // Include only replies (notes with #e tags)
//                 filteredNotes = notes.filter((note) => note.tags.some((tag) => tag[0] === "e"));
//                 break;
//             case NoteFilterOptions.All:
//             default:
//                 // Include all notes
//                 filteredNotes = notes;
//                 break;
//         }

//         return filteredNotes.sort((a, b) => b.created_at - a.created_at);
//     } catch (error) {
//         console.error("Failed to fetch bookmarked notes:", error);
//         return [];
//     }
// };

// export const publishBookmark = async (pool: SimplePool, noteId: string, pubkey: string, privkey: string): Promise<boolean> => {
//     try {
//         const { type, data: sk } = nip19.decode(privkey);

//         if (type !== "nsec") {
//             throw new Error("Invalid private key format...");
//         }

//         // Create an unsigned event
//         const unsignedEvent: UnsignedEvent = {
//             kind: 10003, // Bookmark event kind
//             pubkey,
//             created_at: Math.floor(Date.now() / 1000),
//             tags: [["e", noteId]], // Tag the bookmarked note
//             content: "", // Bookmarks typically have no content
//         };

//         // Finalize the event (generates id and sig)
//         const event: NostrEvent = finalizeEvent(unsignedEvent, sk);

//         // Publish to relays
//         const pub = pool.publish(RELAYS, event);

//         // Wait for confirmation from at least one relay
//         await Promise.all(pub);

//         return true;
//     } catch (error) {
//         console.error("Failed to publish bookmark:", error);
//         return false;
//     }
// };
