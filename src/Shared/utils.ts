export const HIDE_ALERT_TIMEOUT_IN_MS = 6000;
export const DEFAULT_NUM_OF_DISPLAYED_USERS = 15;
export const DEFAULT_NUM_OF_DISPLAYED_NOTES = 20;

export enum PROFILE_CONTENT_TABS {
    NOTES = "notes",
    READS = "reads",
    REPLIES = "replies",
    FOLLOWERS = "followers",
    FOLLOWING = "following",
}

// Common Nostr relays
export const RELAYS = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net/"];

export const extractImageUrls = (content: string): { text: string; images: string[] } => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^ ]*)?(?=\s|$)/i;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let text = content;
    const images: string[] = [];

    // Extract image URLs
    const urlMatches = content.match(urlRegex);

    if (urlMatches) {
        urlMatches.forEach((url) => {
            if (url.match(imageExtensions)) {
                images.push(url);
                text = text.replace(url, "").trim();
            }
        });
    }

    return { text, images };
};
