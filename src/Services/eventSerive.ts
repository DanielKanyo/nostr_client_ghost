import { Filter, NostrEvent, SimplePool } from "nostr-tools";

import { mapReferencedEvents } from "../Shared/eventUtils";
import { RELAYS } from "../Shared/utils";

export const fetchEventByIds = async (pool: SimplePool, eventIds: string[]): Promise<NostrEvent[]> => {
    if (!eventIds.length) {
        console.warn("No event IDs provided to fetch events");
        return [];
    }

    const filter: Filter = {
        ids: eventIds,
    };

    try {
        const events = await pool.querySync(RELAYS, filter);

        // Filter to ensure only requested event IDs are returned
        const matchingEvents = events.filter((event) => eventIds.includes(event.id));

        if (matchingEvents.length === 0) {
            console.warn(`No events found for provided IDs: ${eventIds.join(", ")}`);
            return [];
        }

        return matchingEvents;
    } catch (error) {
        console.error(`Failed to fetch events with IDs ${eventIds.join(", ")}:`, error);
        return [];
    }
};

export const collectReplyEventsAndPubkeys = async (
    pool: SimplePool,
    notes: NostrEvent[]
): Promise<{ replyEvents: NostrEvent[]; pubkeys: string[] }> => {
    const referencedEvents = mapReferencedEvents(notes);

    const eventIds = referencedEvents.map((r) => r.replyToEventId);
    let referencedEventDetails: NostrEvent[] = [];

    try {
        referencedEventDetails = await fetchEventByIds(pool, eventIds);
    } catch (error) {
        console.error("Error loading reply events:", error);
    }

    const pubkeys = referencedEventDetails.map((re) => re.pubkey);

    return { replyEvents: referencedEventDetails, pubkeys };
};
