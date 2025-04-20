import { finalizeEvent, getPublicKey, nip19, NostrEvent, SimplePool } from "nostr-tools";

import { convertPrivateKeyToPrivateKeyBytes, NoteFilterOptions, RELAYS } from "../Shared/utils";

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

export const publishNote = async (pool: SimplePool, content: string, privateKey: string, tags: string[][] = []): Promise<string> => {
    try {
        const privateKeyBytes = convertPrivateKeyToPrivateKeyBytes(privateKey);
        const pubkey = getPublicKey(privateKeyBytes);

        const event = {
            kind: 1,
            pubkey,
            created_at: Math.floor(Date.now() / 1000),
            content,
            tags,
        };

        const signedEvent = finalizeEvent(event, privateKeyBytes);
        const pubs = pool.publish(RELAYS, signedEvent);

        await Promise.all(pubs);

        return signedEvent.id;
    } catch (error) {
        console.error("Failed to publish note:", error);
        throw new Error("Unable to publish note! Please try again later...");
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
