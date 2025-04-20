import { Relay } from "nostr-tools/relay";

export enum RELAY_STATUSES {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    WARNING = "WARNING",
    UNKNOWN = "UNKNOWN",
}

export type RelayStatus = RELAY_STATUSES.ONLINE | RELAY_STATUSES.OFFLINE | RELAY_STATUSES.WARNING | RELAY_STATUSES.UNKNOWN;

export async function checkRelaysStatus(relays: string[]): Promise<Map<string, RelayStatus>> {
    const connectionPromises = relays.map(async (relayUrl) => {
        try {
            const relay = await Relay.connect(relayUrl);
            relay.close();
            return { url: relayUrl, status: RELAY_STATUSES.ONLINE };
        } catch (error) {
            console.error(`Failed to connect to ${relayUrl}:`, error);
            return { url: relayUrl, status: RELAY_STATUSES.OFFLINE };
        }
    });

    const results = await Promise.all(connectionPromises);
    const statusMap = new Map<string, RelayStatus>();

    results.forEach(({ url, status }) => {
        statusMap.set(url, status);
    });

    return statusMap;
}
