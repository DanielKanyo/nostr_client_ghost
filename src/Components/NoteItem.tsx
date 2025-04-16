import { NostrEvent } from "nostr-tools";

import { Container, Divider, Group, Stack, Text, Image } from "@mantine/core";

import { extractImageUrlsAndNostrTags } from "../Shared/utils";

interface NoteItemProps {
    note: NostrEvent;
}

export default function NoteItem({ note }: NoteItemProps) {
    const { text, images } = extractImageUrlsAndNostrTags(note.content);

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
                <Text size="md" lineClamp={4}>
                    {text}
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
            <Divider />
        </>
    );
}
