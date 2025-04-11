import { ActionIcon, CopyButton, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface PublicKeyInputProps {
    publicKey: string;
    primaryColor: string;
    withLabels: boolean;
}

export default function PublicKeyInput({ publicKey, primaryColor, withLabels }: PublicKeyInputProps) {
    return (
        <TextInput
            variant="filled"
            mt="lg"
            size="md"
            radius="md"
            label={withLabels && "Public Key"}
            description={withLabels && "Anyone on Nostr can find you via your public key. Feel free to share anywhere."}
            rightSection={
                <CopyButton value={publicKey} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                            <ActionIcon color={copied ? primaryColor : "gray"} variant="light" radius="md" onClick={copy}>
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            }
            value={publicKey}
            readOnly
        />
    );
}
