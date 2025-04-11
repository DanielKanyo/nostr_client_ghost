import { useMemo } from "react";
import { Link } from "react-router-dom";

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
    Text,
    useComputedColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconMail, IconQrcode, IconUserEdit, IconUserPlus } from "@tabler/icons-react";

import PublicKeyInput from "../../Components/PublicKeyInput";
import QRCode from "../../Components/QrCode";
import { ROUTES } from "../../Routes/routes";
import { encodeNPub } from "../../Services/userService";

interface ProfileHeaderProps {
    publicKey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
    banner: string | undefined;
    about: string | undefined;
    primaryColor: string;
    followers: string[];
    following: string[];
    ownKey: boolean;
}

export default function ProfileHeader({
    publicKey,
    name,
    displayName,
    about,
    banner,
    picture,
    primaryColor,
    followers,
    following,
    ownKey,
}: ProfileHeaderProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const [qrModalOpened, { open: openQrModal, close: closeQrModal }] = useDisclosure(false);

    const npub = useMemo(() => encodeNPub(publicKey), [publicKey]);

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
                    {/* TODO: Move to component */}
                    {ownKey ? (
                        <>
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
                        </>
                    ) : (
                        <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label="follow">
                            <IconUserPlus />
                        </ActionIcon>
                    )}
                </Group>
                <Group justify="space-between" px="lg" align="flex-end">
                    <Flex direction="column">
                        <Box w={300}>
                            <Text ta="left" fz={26} truncate="end">
                                {displayName ?? "Undefined"}
                            </Text>
                            <Text ta="left" c="dimmed" fz={18} lh={1} truncate="end">
                                @{name ?? "Undefined"}
                            </Text>
                        </Box>
                    </Flex>
                    {/* TODO: Move to component */}
                    <Flex gap="xs">
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
                    </Flex>
                </Group>
                {about && (
                    <Text px="lg" pt="lg" fz={16}>
                        {about}
                    </Text>
                )}
            </Box>
            {/* TODO: Move to component */}
            <Modal
                opened={qrModalOpened}
                onClose={closeQrModal}
                title="Nostr Public Key"
                centered
                padding="lg"
                radius="lg"
                overlayProps={{ blur: 3 }}
            >
                {npub && (
                    <>
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
