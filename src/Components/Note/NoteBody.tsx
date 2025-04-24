import { JSX, useMemo } from "react";
import { Link } from "react-router-dom";

import { NostrEvent } from "nostr-tools";

import { Card, Image, Text, TypographyStylesProvider } from "@mantine/core";

import { PROFILE_ROUTE_BASE } from "../../Routes/routes";
import { encodeNProfile } from "../../Services/userService";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";
import VideoRenderer from "./VideoRenderer";

interface NoteBodyProps {
    text: string;
    images: string[];
    videos: string[];
    reply: NostrEvent | undefined;
    replyTo: UserMetadata | undefined;
}

export default function NoteBody({ text, images, videos, reply, replyTo }: NoteBodyProps) {
    const { color } = useAppSelector((state) => state.primaryColor);

    const replacedNostrTags = useMemo((): JSX.Element[] => {
        const nostrTagRegex = /nostr:(nprofile[0-9a-z]+|npub1[0-9a-z]+)/g;
        const parts = text.split(nostrTagRegex);
        const matches = text.match(nostrTagRegex) || [];

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
                        @user
                    </Link>
                );
            }
        });

        return elements;
    }, [text]);

    const replyToText = useMemo(() => {
        if (!reply) {
            return null;
        }

        const name = replyTo!.display_name || replyTo!.name || `${reply!.pubkey.slice(0, 20)}...`;
        const to = `${PROFILE_ROUTE_BASE}/${encodeNProfile(reply!.pubkey)}`;

        return (
            <Link to={to} style={{ color: `var(--mantine-color-${color}-3)`, textDecoration: "none" }}>
                @{name}
            </Link>
        );
    }, [reply, replyTo]);

    return (
        <>
            {replyToText && (
                <Text c="dimmed" fz={14}>
                    reply to {replyToText}
                </Text>
            )}
            {text && (
                <Text style={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }} lineClamp={9} component="div">
                    <TypographyStylesProvider>
                        <div>{replacedNostrTags}</div>
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
