import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { SimplePool } from "nostr-tools";

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
    NumberFormatter,
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
import { closePool, encodeNPub, getFollowers, getFollowing } from "../../Services/userService";

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

    const npub = useMemo(() => encodeNPub(publicKey), [publicKey]);

    useEffect(() => {
        const loadStats = async () => {
            const pool = new SimplePool();

            try {
                const [follows, fans] = await Promise.all([getFollowing(pool, publicKey), getFollowers(pool, publicKey)]);

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
                        color={primaryColor}
                        variant="filled"
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
                        to={ROUTES.SETTINGS_PROFILE}
                    >
                        <IconUserEdit />
                    </ActionIcon>
                </Group>
                <Group justify="space-between" px="lg" align="flex-end">
                    <Flex direction="column">
                        <Box w={150}>
                            <Text ta="left" fz={26} truncate="end">
                                {displayName ?? "Undefined"}
                            </Text>
                            <Text ta="left" c="dimmed" fz={18} lh={1} truncate="end">
                                @{name ?? "Undefined"}
                            </Text>
                        </Box>
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
                                        <NumberFormatter thousandSeparator value={followers.length} />{" "}
                                    </Text>
                                    <Text ml={6} fz={14} c="dimmed">
                                        Followers
                                    </Text>
                                </Button>
                                <Button variant="light" color="gray" radius="xl" size="xs">
                                    <Text fz={14} fw="bolder">
                                        <NumberFormatter thousandSeparator value={following.length} />{" "}
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
                    <Text px="lg" pt="lg" fz={16}>
                        {about}
                    </Text>
                )}
            </Box>

            <Modal
                opened={qrModalOpened}
                onClose={closeQrModal}
                title="Your Nostr Public Key"
                centered
                padding="lg"
                radius="lg"
                overlayProps={{ blur: 3 }}
            >
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
