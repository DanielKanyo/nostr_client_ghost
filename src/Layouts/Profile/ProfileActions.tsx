import { useMemo } from "react";
import { Link } from "react-router-dom";

import { Group, ActionIcon, Center, Modal, Tooltip, MantineColor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconQrcode, IconMail, IconUserEdit, IconWorldWww } from "@tabler/icons-react";

import FollowOrUnfollowBtn from "../../Components/FollowOrUnfollowBtn";
import PublicKeyInput from "../../Components/PublicKeyInput";
import QRCode from "../../Components/QrCode";
import { ROUTES } from "../../Routes/routes";
import { encodeNPub } from "../../Services/userService";
import { useAppSelector } from "../../Store/hook";

interface ProfileActionsProps {
    ownKey: boolean;
    publicKey: string;
    website: string | undefined;
}

export default function ProfileActions({ ownKey, publicKey, website }: ProfileActionsProps) {
    const [qrModalOpened, { open: openQrModal, close: closeQrModal }] = useDisclosure(false);
    const npub = useMemo(() => encodeNPub(publicKey), [publicKey]);
    const user = useAppSelector((state) => state.user);
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;

    const iconProps = {
        variant: "light" as const,
        color: "gray",
        size: "xl" as const,
        radius: "xl" as const,
    };

    return (
        <>
            <Group justify="flex-end" gap="xs" p="lg">
                <Tooltip label="More options" withArrow>
                    <ActionIcon aria-label="dots" {...iconProps}>
                        <IconDots />
                    </ActionIcon>
                </Tooltip>

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
                    <FollowOrUnfollowBtn loggedInUser={user} pubkey={publicKey} color={primaryColor} />
                )}
            </Group>

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
                        <Center mb="md">
                            <QRCode publicKey={npub} size={250} />
                        </Center>
                        <PublicKeyInput publicKey={npub} withLabels={false} />
                    </>
                )}
            </Modal>
        </>
    );
}
