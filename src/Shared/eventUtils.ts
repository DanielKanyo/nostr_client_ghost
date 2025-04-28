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

type ParsedTags = {
    roots: string[];
    replies: string[];
    mentions: string[];
    pubkeys: string[];
    hashtags: string[];
    urls: string[];
};

export const parseTags = (note: NostrEvent) => {
    const result: ParsedTags = {
        roots: [],
        replies: [],
        mentions: [],
        pubkeys: [],
        hashtags: [],
        urls: [],
    };

    for (const tag of note.tags) {
        const [type, value, _relay, marker] = tag;

        if (type === "e") {
            if (marker === "root") {
                result.roots.push(value);
            } else if (marker === "reply") {
                result.replies.push(value);
            } else {
                result.mentions.push(value);
            }
        }

        if (type === "p") {
            result.pubkeys.push(value);
        }

        if (type === "t") {
            result.hashtags.push(value);
        }

        if (type === "r" || type === "u") {
            result.urls.push(value);
        }
    }

    return result;
};

export const findReplyDetailForNote = (note: NostrEvent, replyDetails: NostrEvent[]): NostrEvent | undefined => {
    if (!replyDetails.length) return undefined;

    const parsedTags = parseTags(note);
    let id = parsedTags.replies.length ? parsedTags.replies[0] : null;

    if (!id) {
        id = parsedTags.roots.length ? parsedTags.roots[0] : null;
    }

    if (!id) return undefined;

    return replyDetails.find((reply) => reply.id === id);
};
