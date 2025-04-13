import { useEffect, useRef, useState } from "react";

import { SimplePool } from "nostr-tools";

import {
    Flex,
    Button,
    NumberFormatter,
    Text,
    Modal,
    Tabs,
    MantineColor,
    ScrollArea,
    Loader,
    Center,
    Stack,
    Avatar,
    Card,
    Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";

import { closePool, encodeNPub, fetchUserMetadata } from "../../Services/userService";
import { DEFAULT_NUM_OF_DISPLAYED_USERS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";
import classes from "./tabs.module.css";

interface FollowersAndFollowing {
    followers: string[];
    following: string[];
}

interface FollowersProps {
    loading: boolean;
    followersMetadata: UserMetadata[];
    loadMore: () => void;
}

const EmptyList = () => {
    return (
        <Center py="lg">
            <Stack align="center" gap="xs">
                <IconX />
                <Text>No followers so far</Text>
            </Stack>
        </Center>
    );
};

const Followers = ({ loading, followersMetadata, loadMore }: FollowersProps) => {
    return (
        <>
            {!followersMetadata.length && <EmptyList />}
            {loading && <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />}
            {followersMetadata.map((user) => (
                <Card key={user.pubkey} shadow="sm" padding="md" radius="md" withBorder mt="sm">
                    <Group>
                        <Avatar src={user.picture} radius="xl" size="lg" />
                        <Text fw={500}>{user.display_name || user.name || encodeNPub(user.pubkey)}</Text>
                    </Group>
                </Card>
            ))}
            <Button fullWidth mt="sm" variant="filled" onClick={loadMore}>
                Load More
            </Button>
        </>
    );
};

export default function FollowersAndFollowing({ followers, following }: FollowersAndFollowing) {
    const [opened, { open, close }] = useDisclosure(false);
    const [followersMetadata, setFollowersMetadata] = useState<UserMetadata[]>([]);
    const [followersDisplayCount, setFollowersDisplayCount] = useState(DEFAULT_NUM_OF_DISPLAYED_USERS);
    const [loading, setLoading] = useState<boolean>(false);
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;
    const seenPubkeys = useRef<Set<string>>(new Set());

    const countStyle = { fontSize: 14, fontWeight: 700 };
    const buttonProps = {
        variant: "light" as const,
        color: "gray",
        size: "xs" as const,
        radius: "xl" as const,
    };

    useEffect(() => {
        const fetchMetadata = async (pubkeys: string[]) => {
            setLoading(true);

            const pool = new SimplePool();

            try {
                const fetchedMetadata = await Promise.all(
                    pubkeys.map(async (pubkey) => {
                        const meta = await fetchUserMetadata(pool, pubkey);
                        if (meta) return { pubkey, ...meta };
                        return null;
                    })
                );

                setFollowersMetadata(fetchedMetadata.filter(Boolean) as UserMetadata[]);
            } catch (error) {
                console.error("Error fetching metadata", error);
            } finally {
                setLoading(false);
                closePool(pool);
            }
        };

        fetchMetadata(followers.slice(0, DEFAULT_NUM_OF_DISPLAYED_USERS));
    }, [followers]);

    const loadMore = () => {
        // TODO: Load more
    };

    return (
        <>
            <Flex gap="xs">
                <Button {...buttonProps}>
                    <Text style={countStyle}>
                        <NumberFormatter thousandSeparator value={followers.length} />{" "}
                    </Text>
                    <Text ml={6} fz={14} c="dimmed" onClick={open}>
                        Followers
                    </Text>
                </Button>
                <Button {...buttonProps}>
                    <Text style={countStyle}>
                        <NumberFormatter thousandSeparator value={following.length} />{" "}
                    </Text>
                    <Text ml={6} fz={14} c="dimmed">
                        Following
                    </Text>
                </Button>
            </Flex>

            <Modal
                title="Followers and Following"
                opened={opened}
                onClose={close}
                centered
                overlayProps={{ blur: 3 }}
                padding="lg"
                radius="lg"
                size="lg"
                classNames={classes}
            >
                <Tabs radius="lg" defaultValue="followers" color={primaryColor}>
                    <Tabs.List grow>
                        <Tabs.Tab value="followers">Followers</Tabs.Tab>
                        <Tabs.Tab value="following">Following</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="followers">
                        <ScrollArea h={600} overscrollBehavior="contain" scrollbarSize={6}>
                            <Followers loading={loading} followersMetadata={followersMetadata} loadMore={loadMore} />
                        </ScrollArea>
                    </Tabs.Panel>

                    <Tabs.Panel value="following">
                        <ScrollArea h={600} overscrollBehavior="contain" scrollbarSize={6}>
                            {!following.length && <EmptyList />}
                        </ScrollArea>
                    </Tabs.Panel>
                </Tabs>
            </Modal>
        </>
    );
}
