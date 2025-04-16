import { useEffect, useState, useCallback } from "react";

import { SimplePool } from "nostr-tools";

import { Alert, Button, Center, Container, Loader } from "@mantine/core";
import { IconDots, IconExclamationCircle, IconX } from "@tabler/icons-react";

import UserItem from "../../Components/UserItem";
import { closePool, fetchMultipleUserMetadata } from "../../Services/userService";
import { UserMetadata } from "../../Types/userMetadata";

interface UserListProps {
    pubkeys: string[];
}

const EmptyList = () => (
    <Center>
        <IconX />
    </Center>
);

export default function UserList({ pubkeys }: UserListProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [usersMetadata, setUsersMetadata] = useState<UserMetadata[]>([]);
    const [fetchedCount, setFetchedCount] = useState(0);
    const BATCH_SIZE = 20;

    const fetchMetadataBatch = useCallback(
        async (startIndex: number) => {
            if (startIndex >= pubkeys.length) return;

            setLoading(true);
            const pool = new SimplePool();

            try {
                const batchPubkeys = pubkeys.slice(startIndex, startIndex + BATCH_SIZE);

                if (!batchPubkeys.length) return;

                const metadataMap = await fetchMultipleUserMetadata(pool, batchPubkeys);

                setUsersMetadata((prev) => {
                    const existingMap = new Map(prev.map((item) => [item.pubkey, item]));
                    metadataMap.forEach((item, pubkey) => existingMap.set(pubkey, item));
                    return Array.from(existingMap.values());
                });

                setFetchedCount(startIndex + batchPubkeys.length);
            } catch (fetchError) {
                setError("Failed to load the data! Please try again later...");
            } finally {
                setLoading(false);
                closePool(pool);
            }
        },
        [pubkeys]
    );

    useEffect(() => {
        setUsersMetadata([]);
        setFetchedCount(0);
        setError("");

        if (pubkeys.length > 0) {
            fetchMetadataBatch(0);
        }
    }, [pubkeys, fetchMetadataBatch]);

    if (!pubkeys.length) return <EmptyList />;

    if (error) {
        return (
            <Alert variant="light" color="red" radius="md" title="Error" icon={<IconExclamationCircle />}>
                {error}
            </Alert>
        );
    }

    return (
        <>
            {usersMetadata.map((user) => (
                <UserItem key={user.pubkey} pubkey={user.pubkey} name={user.name} displayName={user.display_name} picture={user.picture} />
            ))}
            {loading && (
                <Center>
                    <Loader size={36} my="md" color="var(--mantine-color-dark-0)" type="dots" />
                </Center>
            )}
            {fetchedCount < pubkeys.length && !loading && (
                <Container m="md" p={0}>
                    <Button
                        variant="subtle"
                        color="gray"
                        radius="md"
                        onClick={() => fetchMetadataBatch(fetchedCount)}
                        loading={loading}
                        loaderProps={{ type: "dots" }}
                        fullWidth
                    >
                        <IconDots />
                    </Button>
                </Container>
            )}
        </>
    );
}
