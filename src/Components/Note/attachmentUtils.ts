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
