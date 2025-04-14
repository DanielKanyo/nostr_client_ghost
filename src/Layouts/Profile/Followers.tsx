import { useEffect, useState, useCallback } from "react";

import { SimplePool } from "nostr-tools";

import { Alert, Avatar, Button, Card, Center, Group, Loader, Stack, Text } from "@mantine/core";
import { IconExclamationCircle, IconX } from "@tabler/icons-react";

import { encodeNPub, RELAYS } from "../../Services/userService";
import { UserMetadata } from "../../Types/userMetadata";

interface FollowersProps {
    followers: string[];
}

const EmptyList = () => (
    <Center py="lg">
        <Stack align="center" gap="xs">
            <IconX />
            <Text>No followers so far</Text>
        </Stack>
    </Center>
);

export default function Followers({ followers }: FollowersProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [followersMetadata, setFollowersMetadata] = useState<UserMetadata[]>([]);
    const [fetchedCount, setFetchedCount] = useState(0);
    const BATCH_SIZE = 20;

    const fetchMetadataBatch = useCallback(
        async (startIndex: number) => {
            if (startIndex >= followers.length) return;

            setLoading(true);
            const pool = new SimplePool();

            try {
                const batchPubkeys = followers.slice(startIndex, startIndex + BATCH_SIZE);

                if (!batchPubkeys.length) return;

                const events = await pool.querySync(RELAYS, {
                    kinds: [0],
                    authors: batchPubkeys,
                });

                const metadataMap = new Map<string, UserMetadata>();

                events.forEach((event) => {
                    try {
                        const metadata = JSON.parse(event.content);
                        const existing = metadataMap.get(event.pubkey);

                        if (!existing || (existing.created_at && event.created_at > existing.created_at)) {
                            metadataMap.set(event.pubkey, {
                                pubkey: event.pubkey,
                                ...metadata,
                                created_at: event.created_at,
                            });
                        }
                    } catch (parseError) {
                        console.error(`Failed to parse metadata for ${event.pubkey}:`, parseError);
                    }
                });

                setFollowersMetadata((prev) => {
                    const existingMap = new Map(prev.map((item) => [item.pubkey, item]));
                    metadataMap.forEach((item, pubkey) => existingMap.set(pubkey, item));
                    return Array.from(existingMap.values());
                });

                setFetchedCount(startIndex + batchPubkeys.length);
            } catch (fetchError) {
                setError("Failed to load the followers! Please try again later...");
            } finally {
                setLoading(false);
                pool.close(RELAYS);
            }
        },
        [followers]
    );

    useEffect(() => {
        setFollowersMetadata([]);
        setFetchedCount(0);
        setError("");

        if (followers.length > 0) {
            fetchMetadataBatch(0);
        }
    }, [followers, fetchMetadataBatch]);

    if (!followers.length) return <EmptyList />;

    if (error) {
        return (
            <Alert variant="light" color="red" radius="md" title="Error" icon={<IconExclamationCircle />}>
                {error}
            </Alert>
        );
    }

    return (
        <Stack gap="sm">
            {followersMetadata.map((user) => (
                <Card key={user.pubkey} shadow="sm" padding="md" radius="md">
                    <Group>
                        <Avatar src={user.picture} radius="xl" size="md" />
                        <Text fw={500}>{user.display_name || user.name || encodeNPub(user.pubkey)}</Text>
                    </Group>
                </Card>
            ))}
            {loading && (
                <Center>
                    <Loader size={36} color="var(--mantine-color-dark-0)" type="dots" />
                </Center>
            )}
            {fetchedCount < followers.length && !loading && (
                <Button
                    variant="light"
                    color="gray"
                    onClick={() => fetchMetadataBatch(fetchedCount)}
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                >
                    Load More
                </Button>
            )}
        </Stack>
    );
}
