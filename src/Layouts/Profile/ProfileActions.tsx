import { useMemo } from "react";
import { Link } from "react-router-dom";

import { ActionIcon, Center, CopyButton, Group, Menu, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconKey, IconLink, IconMail, IconQrcode, IconUserCancel, IconUserEdit, IconWorldWww, IconX } from "@tabler/icons-react";

import FollowOrUnfollowButton from "../../Components/FollowOrUnfollowButton";
import PublicKeyInput from "../../Components/PublicKeyInput";
import QRCode from "../../Components/QrCode";
import { PROFILE_ROUTE_BASE, ROUTES } from "../../Routes/routes";
import { encodeNProfile, encodeNPub } from "../../Services/userService";
import { useAppSelector } from "../../Store/hook";

interface ProfileActionsProps {
    ownKey: boolean;
    pubkey: string;
    website: string | undefined;
}

export default function ProfileActions({ ownKey, pubkey, website }: ProfileActionsProps) {
    const [qrModalOpened, { open: openQrModal, close: closeQrModal }] = useDisclosure(false);
    const npub = useMemo(() => encodeNPub(pubkey), [pubkey]);
    const user = useAppSelector((state) => state.user);
    const { color } = useAppSelector((state) => state.primaryColor);

    const iconProps = {
        variant: "light" as const,
        color: "gray",
        size: "xl" as const,
        radius: "xl" as const,
    };

    return (
        <>
            <Group justify="flex-end" gap="xs" p="lg">
                <Menu shadow="lg" radius="md" width={250} withArrow>
                    <Menu.Target>
                        <Tooltip label="More options" withArrow>
                            <ActionIcon aria-label="dots" {...iconProps}>
                                <IconDots />
                            </ActionIcon>
                        </Tooltip>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <CopyButton value={npub} timeout={2000}>
                            {({ copy }) => (
                                <Menu.Item fz="md" leftSection={<IconKey size={18} />} onClick={copy}>
                                    Copy User Public Key
                                </Menu.Item>
                            )}
                        </CopyButton>
                        <CopyButton value={`${window.location.origin}${PROFILE_ROUTE_BASE}/${encodeNProfile(pubkey)}`} timeout={2000}>
                            {({ copy }) => (
                                <Menu.Item fz="md" leftSection={<IconLink size={18} />} onClick={copy}>
                                    Copy User Link
                                </Menu.Item>
                            )}
                        </CopyButton>
                        {!ownKey && (
                            <Menu.Item fz="md" leftSection={<IconUserCancel size={18} />} color="red">
                                Mute User
                            </Menu.Item>
                        )}
                    </Menu.Dropdown>
                </Menu>

                {website && (
                    <Tooltip label="Open Website" withArrow>
                        <ActionIcon aria-label="webiste" {...iconProps} component={Link} to={website} target="_blank">
                            <IconWorldWww />
                        </ActionIcon>
                    </Tooltip>
                )}

                <Tooltip label="Show QR code" withArrow>
                    <ActionIcon aria-label="qr" onClick={openQrModal} {...iconProps}>
                        <IconQrcode />
                    </ActionIcon>
                </Tooltip>

                {ownKey ? (
                    <>
                        <Tooltip label="Messages" withArrow>
                            <ActionIcon aria-label="messages" component={Link} to={ROUTES.MESSAGES} {...iconProps}>
                                <IconMail />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Edit profile" withArrow>
                            <ActionIcon aria-label="account-settings" component={Link} to={ROUTES.SETTINGS_PROFILE} {...iconProps}>
                                <IconUserEdit />
                            </ActionIcon>
                        </Tooltip>
                    </>
                ) : (
                    <FollowOrUnfollowButton loggedInUser={user} pubkey={pubkey} color={color} />
                )}
            </Group>

            <Modal
                opened={qrModalOpened}
                onClose={closeQrModal}
                title="Nostr Public Key"
                centered
                padding="lg"
                radius="lg"
                size={495}
                overlayProps={{ blur: 3 }}
                closeButtonProps={{
                    icon: <IconX size={20} />,
                    radius: "xl",
                    size: "lg",
                }}
            >
                {npub && (
                    <>
                        <Center mb="md">
                            <QRCode pubkey={npub} size={250} />
                        </Center>
                        <PublicKeyInput pubkey={npub} withLabels={false} />
                    </>
                )}
            </Modal>
        </>
    );
}
