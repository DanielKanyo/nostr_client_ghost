import { Filter, NostrEvent, SimplePool } from "nostr-tools";

import { parseTags } from "../Shared/eventUtils";
import { RELAYS } from "../Shared/utils";
import { UserMetadata } from "../Types/userMetadata";
import { fetchMultipleUserMetadata } from "./userService";

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

export const collectReferenceEventsAndUsersMetadata = async (
    pool: SimplePool,
    notes: NostrEvent[]
): Promise<{ referenceEvents: NostrEvent[]; referenceUsersMetadata: UserMetadata[] }> => {
    const parsedTags = notes.map((note) => parseTags(note));
    const eventIds = parsedTags.flatMap((item) => (item.replies.length ? item.replies : [...item.roots, ...item.replies]));
    const pubkeys = parsedTags.flatMap((item) => item.pubkeys);

    let referenceEvents: NostrEvent[] = [];
    let referenceUsersMetadata = new Map<string, UserMetadata>();

    try {
        referenceEvents = await fetchEventByIds(pool, eventIds);
        referenceUsersMetadata = await fetchMultipleUserMetadata(pool, pubkeys);
    } catch (error) {
        // TODO: Handle errors
        console.error("Error loading reply events:", error);
    }

    return { referenceEvents, referenceUsersMetadata: Array.from(referenceUsersMetadata.values()) };
};
