import { JSX, useMemo } from "react";
import { Link } from "react-router-dom";

import { NostrEvent } from "nostr-tools";

import { ActionIcon, Avatar, Card, Container, Divider, Flex, Group, Image, Stack, Text, TypographyStylesProvider } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";

import { PROFILE_ROUTE_BASE } from "../Routes/routes";
import { extractImageUrls, formatTimestamp } from "../Shared/utils";
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

    const userMetadata = useMemo(() => usersMetadata.find((u) => u.pubkey === note.pubkey), [usersMetadata, note.pubkey]);

    console.log(userMetadata);

    const displayName = userMetadata?.display_name || userMetadata?.name || `${note.pubkey.slice(0, 8)}...`;

    return (
        <>
            <Container p="md">
                <Flex>
                    <Avatar src={userMetadata?.picture} radius={45} size={45} />
                    <Stack w="100%" gap="sm" pl="md">
                        <Group justify="space-between">
                            <Group gap={5}>
                                <Text size="md" fw={700}>
                                    {displayName}
                                </Text>
                                <Text c="dimmed" size="lg">
                                    ·
                                </Text>
                                <Text c="dimmed" size="md">
                                    {formatTimestamp(note.created_at * 1000)}
                                </Text>
                            </Group>
                            <ActionIcon aria-label="dots" variant="subtle" size={28} color="gray" radius="xl">
                                <IconDots size={18} />
                            </ActionIcon>
                        </Group>
                        <Text style={{ whiteSpace: "pre-line" }} lineClamp={9} component="div">
                            <TypographyStylesProvider>
                                <div>{replaceNostrTags(text)}</div>
                            </TypographyStylesProvider>
                        </Text>
                        {images.length > 0 && (
                            <Card withBorder radius="lg" p={0} style={{ overflow: "hidden" }}>
                                <Image src={images[0]} alt="note-image" style={{ width: "100%" }} />
                            </Card>
                        )}
                        <Group justify="space-between">footer</Group>
                    </Stack>
                </Flex>
            </Container>
            <Divider />
        </>
    );
}
