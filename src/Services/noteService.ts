import { Filter, finalizeEvent, getPublicKey, nip19, NostrEvent, SimplePool } from "nostr-tools";

import { convertPrivateKeyToPrivateKeyBytes, NoteFilterOptions, RELAYS } from "../Shared/utils";
import { InteractionStats } from "../Types/interactionStats";

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

export const fetchInteractionStats = async (
    pool: SimplePool,
    noteIds: string[],
    relays: string[]
): Promise<{ [noteId: string]: InteractionStats }> => {
    const interactionStats: { [noteId: string]: InteractionStats } = {};

    // Initialize stats for each note
    noteIds.forEach((noteId) => {
        interactionStats[noteId] = { likes: 0, reposts: 0, comments: 0, zapAmount: 0 };
    });

    try {
        // Define individual filters
        const repostsAndLikesFilter: Filter = { kinds: [6, 7], "#e": noteIds };
        const commentsFilter: Filter = { kinds: [1], "#e": noteIds };
        const zapsFilter: Filter = { kinds: [9735], "#e": noteIds };

        // Run queries separately
        const [repostLikeEvents, commentEvents, zapEvents] = await Promise.all([
            pool.querySync(relays, repostsAndLikesFilter),
            pool.querySync(relays, commentsFilter),
            pool.querySync(relays, zapsFilter),
        ]);

        const events = [...repostLikeEvents, ...commentEvents, ...zapEvents];

        events.forEach((event: NostrEvent) => {
            const noteId = event.tags.find((tag) => tag[0] === "e")?.[1];
            if (!noteId || !interactionStats[noteId]) return;

            switch (event.kind) {
                case 7:
                    if (event.content === "+") {
                        interactionStats[noteId].likes += 1;
                    }
                    break;
                case 6:
                    interactionStats[noteId].reposts += 1;
                    break;
                case 1:
                    interactionStats[noteId].comments += 1;
                    break;
                case 9735:
                    try {
                        const bolt11Tag = event.tags.find((tag) => tag[0] === "bolt11");

                        if (!bolt11Tag) return;

                        const bolt11 = bolt11Tag[1];
                        const sats = decodeLightningInvoice(bolt11);

                        if (sats !== null) {
                            interactionStats[noteId].zapAmount += sats;
                        }
                    } catch (e) {
                        console.warn("Failed to parse zap amount:", e);
                    }
                    break;
            }
        });

        return interactionStats;
    } catch (error) {
        console.error("Error fetching interaction counts:", error);
        return interactionStats;
    }
};

const decodeLightningInvoice = (invoice: string): number | null => {
    const prefixMatch = invoice.match(/^lnbc(\d+)([munp]?)1/i);

    if (!prefixMatch) {
        console.warn("Invalid Lightning invoice format");
        return null;
    }

    const amount = parseInt(prefixMatch[1], 10);
    const unit = prefixMatch[2];

    let multiplier: number;

    switch (unit) {
        case "":
            // No unit means full BTC → convert to sats
            multiplier = 100_000_000;
            break;
        case "m": // milliBTC
            multiplier = 100_000;
            break;
        case "u": // microBTC
            multiplier = 100;
            break;
        case "n": // nanoBTC
            multiplier = 0.1;
            break;
        case "p": // picoBTC (very rare)
            multiplier = 0.0001;
            break;
        default:
            console.warn(`Unsupported unit '${unit}' in invoice`);
            return null;
    }

    const sats = amount * multiplier;

    // Round to nearest satoshi and return
    return Math.round(sats);
};
