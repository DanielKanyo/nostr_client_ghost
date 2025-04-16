import { JSX } from "react";
import { Link } from "react-router-dom";

import { NostrEvent } from "nostr-tools";

import { Container, Divider, Group, Stack, Text, Image, TypographyStylesProvider } from "@mantine/core";

import { PROFILE_ROUTE_BASE } from "../Routes/routes";
import { extractImageUrls } from "../Shared/utils";

interface NoteItemProps {
    note: NostrEvent;
}

export const replaceNostrTags = (content: string, replaceWithString: string = "user"): JSX.Element[] => {
    // TODO: provide valid replaceWithString
    const nostrRegex = /nostr:nprofile[0-9a-z]+/g;
    const parts = content.split(nostrRegex);
    const matches = content.match(nostrRegex) || [];

    // Map through the parts and intersperse with Link components
    const elements: JSX.Element[] = [];

    parts.forEach((part, index) => {
        elements.push(<span key={`part-${index}`}>{part}</span>);

        if (matches[index]) {
            const to = `${PROFILE_ROUTE_BASE}/${matches[index].replace("nostr:", "")}`;

            elements.push(
                <Link key={`link-${index}`} to={to}>
                    @{replaceWithString}
                </Link>
            );
        }
    });

    return elements;
};

export default function NoteItem({ note }: NoteItemProps) {
    const { text, images } = extractImageUrls(note.content);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <>
            <Container p="lg">
                <Group justify="space-between" mb="xs">
                    <Text fw={500} size="sm" truncate>
                        {note.pubkey.slice(0, 8)}...
                    </Text>
                    <Text c="dimmed" size="xs">
                        {formatDate(note.created_at)}
                    </Text>
                </Group>
                <TypographyStylesProvider>
                    <Text style={{ whiteSpace: "pre-line" }} lineClamp={9}>
                        <div>{replaceNostrTags(text)}</div>
                    </Text>
                </TypographyStylesProvider>
                {images.length > 0 && (
                    <Stack gap="sm">
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                alt={`Image ${index + 1} from note`}
                                radius="lg"
                                fit="contain"
                                style={{ maxHeight: 300, width: "100%", objectFit: "contain" }}
                                fallbackSrc="https://via.placeholder.com/300x200?text=Image+Not+Found"
                            />
                        ))}
                    </Stack>
                )}
            </Container>
            <Divider />
        </>
    );
}
