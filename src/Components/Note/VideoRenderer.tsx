import { useEffect, useRef } from "react";

import { Box } from "@mantine/core";

import { DEFAULT_VOLUME_FOR_VIDEOS } from "../../Shared/utils";

interface VideoRendererProps {
    url: string;
}

export default function VideoRenderer({ url }: VideoRendererProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    // Check if the URL is a YouTube link
    const isYouTube = url.match(/youtube\.com|youtu\.be/i);

    // Convert YouTube URL to embed format
    const getYouTubeEmbedUrl = (url: string): string => {
        // Handle standard, live, and shortened YouTube URLs
        if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("youtube.com/live/")) {
            const videoId = url.split("youtube.com/live/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("youtube.com/watch?v=")) {
            const videoId = url.split("watch?v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url; // Fallback (shouldn't happen)
    };

    // Set default volume for <video> elements
    useEffect(() => {
        if (videoRef.current && !isYouTube) {
            videoRef.current.volume = DEFAULT_VOLUME_FOR_VIDEOS;
        }
    }, [isYouTube]);

    return (
        <Box style={{ maxWidth: "100%", aspectRatio: "16/9" }} onClick={(e) => e.stopPropagation()}>
            {isYouTube ? (
                <iframe
                    style={{ border: 0 }}
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(url)}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <video
                    ref={videoRef}
                    controls
                    src={url}
                    style={{ maxWidth: "100%", width: "100%", height: "100%", borderRadius: "8px" }}
                    onError={(e) => console.error("Video failed to load:", url, e)}
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </Box>
    );
}
