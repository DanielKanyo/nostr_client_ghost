import { JSX, useMemo } from "react";
import { Link } from "react-router-dom";

import { NostrEvent } from "nostr-tools";

import { Avatar, Container, Divider, Flex, Group, Image, Stack, Text, TypographyStylesProvider } from "@mantine/core";

import { PROFILE_ROUTE_BASE } from "../Routes/routes";
import { extractImageUrls } from "../Shared/utils";
import { UserMetadata } from "../Types/userMetadata";

interface NoteItemProps {
    note: NostrEvent;
    usersMetadata: UserMetadata[];
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

export default function NoteItem({ note, usersMetadata }: NoteItemProps) {
    const { text, images } = extractImageUrls(note.content);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const userMetadata = useMemo(() => usersMetadata.find((u) => u.pubkey === note.pubkey), [usersMetadata, note.pubkey]);

    console.log(userMetadata);

    const displayName = userMetadata?.display_name || userMetadata?.name || `${note.pubkey.slice(0, 8)}...`;

    return (
        <>
            <Container p="md">
                <Flex>
                    <Avatar src={userMetadata?.picture} radius={45} size={45} />
                    <Container w="100%" pr={0}>
                        <Group justify="space-between" mb="xs">
                            <Group>
                                <Flex direction="column" align="flex-start" justify="center">
                                    <Text ta="left" size="md" fw={700}>
                                        {displayName}
                                    </Text>
                                </Flex>
                            </Group>
                            <Text c="dimmed" size="xs">
                                {formatDate(note.created_at)}
                            </Text>
                        </Group>
                        <Text style={{ whiteSpace: "pre-line" }} lineClamp={9} component="div">
                            <TypographyStylesProvider>
                                <div>{replaceNostrTags(text)}</div>
                            </TypographyStylesProvider>
                        </Text>
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
                </Flex>
            </Container>
            <Divider />
        </>
    );
}
