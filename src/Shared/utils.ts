export const HIDE_ALERT_TIMEOUT_IN_MS = 6000;
export const DEFAULT_NUM_OF_DISPLAYED_USERS = 15;
export const DEFAULT_NUM_OF_DISPLAYED_NOTES = 15;

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

export const extractVideoUrls = (content: string): { text: string; videos: string[] } => {
    // Common video file extensions
    const videoExtensions = /\.(mp4|mov|avi|mkv|webm|wmv|flv|m4v)(\?[^ ]*)?(?=\s|$)/i;
    // YouTube URL patterns (including /watch?v=, /live/, and youtu.be/)
    const youtubeRegex = /(https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|live\/)|youtu\.be\/)[^\s]+)/i;
    // General URL regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let text = content;
    const videos: string[] = [];

    // Extract all URLs
    const urlMatches = content.match(urlRegex);

    if (urlMatches) {
        urlMatches.forEach((url) => {
            // Check if URL is a video file or YouTube link
            if (url.match(videoExtensions) || url.match(youtubeRegex)) {
                videos.push(url);
                text = text.replace(url, "").trim();
            }
        });
    }

    return { text, videos };
};

export enum NoteFilterOptions {
    Notes = "Notes",
    Replies = "Replies",
    All = "All",
}

const MONTHS = ["jan.", "feb.", "mar.", "apr.", "may", "jun.", "jul.", "aug.", "sep.", "oct.", "nov.", "dec."];

export const formatTimestamp = (timestamp: number): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
        return `${diffHours}h`;
    }

    const isSameYear = now.getFullYear() === date.getFullYear();
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();

    if (isSameYear) {
        return `${month} ${day}`;
    } else {
        const year = date.getFullYear();
        return `${year}, ${month} ${day}`;
    }
};

export const SCROLL_POS_DEBOUNCE_TIME = 350;

export const DEFAULT_VOLUME_FOR_VIDEOS = 0.3;
