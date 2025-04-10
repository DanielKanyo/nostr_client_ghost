import { PasswordInput, CopyButton, Tooltip, ActionIcon } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface PrivateKeyInput {
    privateKey: string;
    primaryColor: string;
}

export default function PrivateKeyInput({ privateKey, primaryColor }: PrivateKeyInput) {
    return (
        <PasswordInput
            variant="filled"
            mt="lg"
            size="md"
            radius="md"
            label="Private Key"
            description="This key fully controls your Nostr account. Don't share it with anyone. Copy this key and store it securely!"
            rightSection={
                <CopyButton value={privateKey} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                            <ActionIcon color={copied ? primaryColor : "gray"} variant="light" radius="md" onClick={copy}>
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            }
            value={privateKey}
            readOnly
        />
    );
}
