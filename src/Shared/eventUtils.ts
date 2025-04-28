import { NostrEvent } from "nostr-tools";

export type ReplyEvent = {
    eventId: string;
    replyToEventId: string;
    replyToPubkey: string;
    content: string;
    createdAt: number;
    originalEventId: string;
};

export type ReplyEvent2 = {
    eventId: string;
    replyToEventId: string;
    replyToPubkey: string;
    content: string;
    createdAt: number;
    originalEventId: string;
    marker?: string; // <- add this optional field
};

export const mapReplyEvents = (events: NostrEvent[]): ReplyEvent[] => {
    const replyEvents: ReplyEvent[] = [];

    // Iterate over each event to check for "reply" tags
    events.forEach((event) => {
        event.tags.forEach((tag) => {
            // Check if it's an "e" tag (event reference) and has a "reply" marker
            if (tag[0] === "e" && tag[3] === "reply") {
                // Extract the relevant information from the "reply" tag
                const replyToEventId = tag[1];
                // const relayUrl = tag[2];
                const replyToPubkey = tag[4] || ""; // The pubkey of the original event (if provided)

                // Map the event to a reply event structure
                replyEvents.push({
                    eventId: event.id,
                    replyToEventId: replyToEventId,
                    replyToPubkey: replyToPubkey,
                    content: event.content,
                    createdAt: event.created_at,
                    originalEventId: event.id,
                });
            }
        });
    });

    return replyEvents;
};

export const mapReferencedEvents = (events: NostrEvent[]): ReplyEvent2[] => {
    const referencedEvents: ReplyEvent2[] = [];

    events.forEach((event) => {
        event.tags.forEach((tag) => {
            if (tag[0] === "e") {
                const referencedEventId = tag[1];
                // const relayUrl = tag[2]; // optional
                const markerOrPubkey = tag[3] || ""; // Could be "reply", "root", "mention", or missing
                const replyToPubkey = tag[4] || ""; // Pubkey if present (in some cases)

                referencedEvents.push({
                    eventId: event.id,
                    replyToEventId: referencedEventId,
                    replyToPubkey: replyToPubkey,
                    content: event.content,
                    createdAt: event.created_at,
                    originalEventId: event.id,
                    marker: markerOrPubkey, // New field to capture the marker
                });
            }
        });
    });

    return referencedEvents;
};

// TODO: analyze if it can be used
// type ParsedTags = {
//   roots: string[];
//   replies: string[];
//   mentions: string[];
//   pubkeys: string[];
//   hashtags: string[];
//   urls: string[];
// };

// export const useParsedTags = (note: NostrEvent) => {
//   const parsed = useMemo<ParsedTags>(() => {
//     const result: ParsedTags = {
//       roots: [],
//       replies: [],
//       mentions: [],
//       pubkeys: [],
//       hashtags: [],
//       urls: [],
//     };

//     for (const tag of note.tags) {
//       const [type, value, _relay, marker] = tag;

//       if (type === "e") {
//         if (marker === "root") {
//           result.roots.push(value);
//         } else if (marker === "reply") {
//           result.replies.push(value);
//         } else {
//           result.mentions.push(value);
//         }
//       }

//       if (type === "p") {
//         result.pubkeys.push(value);
//       }

//       if (type === "t") {
//         result.hashtags.push(value);
//       }

//       if (type === "r" || type === "u") {
//         result.urls.push(value);
//       }
//     }

//     return result;
//   }, [note.tags]);

//   return parsed;
// };

export const findReplyDetailForNote = (note: NostrEvent, replyDetails: NostrEvent[]): NostrEvent | undefined => {
    if (!replyDetails.length) return undefined;

    // 1. Try to find a "reply" tag (direct parent)
    let id = note.tags.find((tag) => tag[0] === "e" && tag[3] === "reply")?.[1];

    // 2. If no "reply" tag, fallback to any "e" tag (could be a mention or root)
    if (!id) {
        console.log(note.tags);

        id = note.tags.find((tag) => tag[0] === "e" && tag[3] === "root")?.[1];
    }

    if (!id) return undefined;

    // 3. Find the matching reply detail
    return replyDetails.find((reply) => reply.id === id);
};
