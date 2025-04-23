import { NostrEvent } from "nostr-tools";

export type ReplyEvent = {
    eventId: string;
    replyToEventId: string;
    replyToPubkey: string;
    content: string;
    createdAt: number;
    originalEventId: string;
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

export const findReplyForNote = (note: NostrEvent, replies: NostrEvent[]): NostrEvent | undefined => {
    const replyTag = note.tags.find((tag) => tag[0] === "e" && tag[3] === "reply");
    const replyId = replyTag?.[1];

    if (!replyId) return undefined;

    return replies.find((reply) => reply.id === replyId);
};
