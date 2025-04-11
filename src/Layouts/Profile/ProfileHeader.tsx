import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { nip19, SimplePool } from "nostr-tools";

import {
    ActionIcon,
    Avatar,
    BackgroundImage,
    Box,
    Button,
    Center,
    Flex,
    Group,
    Modal,
    Skeleton,
    Text,
    useComputedColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconMail, IconQrcode, IconUserEdit } from "@tabler/icons-react";

import PublicKeyInput from "../../Components/PublicKeyInput";
import QRCode from "../../Components/QrCode";
import { ROUTES } from "../../Routes/routes";
import { closePool, getFollowers, getFollowing } from "../../Services/userService";

interface ProfileHeaderProps {
    publicKey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
    banner: string | undefined;
    about: string | undefined;
    primaryColor: string;
}

export default function ProfileHeader({ publicKey, name, displayName, about, banner, picture, primaryColor }: ProfileHeaderProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const [qrModalOpened, { open: openQrModal, close: closeQrModal }] = useDisclosure(false);
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [followDataLoading, setFollowDataLoading] = useState(true);
    const npub = nip19.npubEncode(publicKey);

    useEffect(() => {
        const loadStats = async () => {
            const pool = new SimplePool();

            try {
                const [follows, fans] = await Promise.all([getFollowing(pool, publicKey), getFollowers(pool, publicKey)]);

                console.log(follows, fans);

                setFollowing(follows);
                setFollowers(fans);
            } catch (err) {
                console.error(err);
            } finally {
                closePool(pool);
                setFollowDataLoading(false);
            }
        };

        loadStats();
    }, []);

    return (
        <>
            <Box w="100%">
                <BackgroundImage
                    src={banner ?? ""}
                    h={200}
                    pos="relative"
                    style={{
                        backgroundColor: theme.colors[primaryColor][6],
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                    }}
                >
                    <Avatar
                        src={picture}
                        size={160}
                        radius={160}
                        pos="absolute"
                        bottom={-65}
                        left={80}
                        style={{ outline: `10px solid ${computedColorScheme === "dark" ? theme.colors.dark[7] : "white"}` }}
                    />
                </BackgroundImage>
                <Group justify="flex-end" gap="xs" p="lg">
                    <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label="dots">
                        <IconDots />
                    </ActionIcon>
                    <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label="qr" onClick={openQrModal}>
                        <IconQrcode />
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        color="gray"
                        size="xl"
                        radius="xl"
                        aria-label="messages"
                        component={Link}
                        to={ROUTES.MESSAGES}
                    >
                        <IconMail />
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        color="gray"
                        size="xl"
                        radius="xl"
                        aria-label="account-settings"
                        component={Link}
                        to={ROUTES.SETTINGS_ACCOUNT}
                    >
                        <IconUserEdit />
                    </ActionIcon>
                </Group>
                <Group justify="space-between" px="lg" align="flex-end">
                    <Flex direction="column">
                        <Text fz={26}>{displayName ?? "Undefined"}</Text>
                        <Text c="dimmed" fz={18} lh={1}>
                            @{name ?? "Undefined"}
                        </Text>
                    </Flex>
                    <Flex gap="xs">
                        {followDataLoading ? (
                            <>
                                <Skeleton height={30} width={102} radius="xl" />
                                <Skeleton height={30} width={102} radius="xl" />
                            </>
                        ) : (
                            <>
                                <Button variant="light" color="gray" radius="xl" size="xs">
                                    <Text fz={14} fw="bolder">
                                        {followers.length}{" "}
                                    </Text>
                                    <Text ml={6} fz={14} c="dimmed">
                                        Followers
                                    </Text>
                                </Button>
                                <Button variant="light" color="gray" radius="xl" size="xs">
                                    <Text fz={14} fw="bolder">
                                        {following.length}{" "}
                                    </Text>
                                    <Text ml={6} fz={14} c="dimmed">
                                        Following
                                    </Text>
                                </Button>
                            </>
                        )}
                    </Flex>
                </Group>
                {about && (
                    <Text p="lg" fz={16}>
                        {about}
                    </Text>
                )}
            </Box>

            <Modal opened={qrModalOpened} onClose={closeQrModal} title="Your Nostr Public Key" centered padding="lg" radius="lg">
                {npub && (
                    <>
                        <Text c="dimmed" fz={13}>
                            Anyone on Nostr can find you via your public key. Feel free to share anywhere.
                        </Text>
                        <Center>
                            <QRCode publicKey={npub} size={250} />
                        </Center>
                        <PublicKeyInput publicKey={npub} primaryColor={primaryColor} withLabels={false} />
                    </>
                )}
            </Modal>
        </>
    );
}
