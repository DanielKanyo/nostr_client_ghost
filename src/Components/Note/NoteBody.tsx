import { JSX } from "react";
import { Link } from "react-router-dom";

import { Card, Image, Text, TypographyStylesProvider } from "@mantine/core";

import { PROFILE_ROUTE_BASE } from "../../Routes/routes";
import VideoRenderer from "./VideoRenderer";

interface NoteBodyProps {
    text: string;
    images: string[];
    videos: string[];
}

const replaceNostrTags = (content: string, replaceWithString: string = "user"): JSX.Element[] => {
    const nostrTagRegex = /nostr:(nprofile[0-9a-z]+|npub1[0-9a-z]+)/g;
    const parts = content.split(nostrTagRegex);
    const matches = content.match(nostrTagRegex) || [];

    const elements: JSX.Element[] = [];

    let matchIndex = 0;

    parts.forEach((part, index) => {
        if (index % 2 === 0) {
            // Even index: plain text
            elements.push(<span key={`part-${index}`}>{part}</span>);
        } else {
            // Odd index: matched tag
            const match = matches[matchIndex++] || "";
            const nostrId = match.replace("nostr:", "");
            const to = `${PROFILE_ROUTE_BASE}/${nostrId}`;

            elements.push(
                <Link key={`link-${index}`} to={to}>
                    @{replaceWithString}
                </Link>
            );
        }
    });

    return elements;
};

export default function NoteBody({ text, images, videos }: NoteBodyProps) {
    return (
        <>
            {text && (
                <Text style={{ whiteSpace: "pre-line" }} lineClamp={9} component="div">
                    <TypographyStylesProvider>
                        <div>{replaceNostrTags(text)}</div>
                    </TypographyStylesProvider>
                </Text>
            )}
            {images.length > 0 && (
                <Card withBorder radius="lg" p={0} style={{ overflow: "hidden" }} mih={250} shadow="md">
                    <Image src={images[0]} alt={images[0]} style={{ width: "100%" }} />
                </Card>
            )}
            {videos.length > 0 && (
                <Card withBorder radius="lg" p={0} style={{ overflow: "hidden" }} shadow="md">
                    <VideoRenderer url={videos[0]} />
                </Card>
            )}
        </>
    );
}
