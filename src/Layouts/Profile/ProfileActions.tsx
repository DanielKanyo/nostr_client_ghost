import { useMemo } from "react";
import { Link } from "react-router-dom";

import { Group, ActionIcon, Center, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconQrcode, IconMail, IconUserEdit, IconUserPlus } from "@tabler/icons-react";

import PublicKeyInput from "../../Components/PublicKeyInput";
import QRCode from "../../Components/QrCode";
import { ROUTES } from "../../Routes/routes";
import { encodeNPub } from "../../Services/userService";

interface ProfileActionsProps {
    ownKey: boolean;
    publicKey: string;
    primaryColor: string;
}

export default function ProfileActions({ ownKey, publicKey, primaryColor }: ProfileActionsProps) {
    const [qrModalOpened, { open: openQrModal, close: closeQrModal }] = useDisclosure(false);
    const npub = useMemo(() => encodeNPub(publicKey), [publicKey]);

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
                    <Tooltip label="Follow" withArrow>
                        <ActionIcon aria-label="follow" {...iconProps}>
                            <IconUserPlus />
                        </ActionIcon>
                    </Tooltip>
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
                        <PublicKeyInput publicKey={npub} primaryColor={primaryColor} withLabels={false} />
                    </>
                )}
            </Modal>
        </>
    );
}
