import { ActionIcon, CopyButton, Flex, TextInput, ThemeIcon, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconInfoSquareRoundedFilled } from "@tabler/icons-react";

import containedInputClasses from "../Shared/Styles/containedInput.module.css";
import { useAppSelector } from "../Store/hook";

interface PublicKeyInputProps {
    publicKey: string;
    withLabels: boolean;
}

export default function PublicKeyInput({ publicKey, withLabels }: PublicKeyInputProps) {
    const primaryColor = useAppSelector((state) => state.primaryColor);

    return (
        <TextInput
            mt="lg"
            radius="md"
            label="Public Key"
            rightSection={
                <Flex gap="xs">
                    {withLabels && (
                        <Tooltip
                            label="Anyone on Nostr can find you via your public key. Feel free to share anywhere."
                            withArrow
                            multiline
                            w={300}
                        >
                            <ThemeIcon variant="light" radius="md" color="gray">
                                <IconInfoSquareRoundedFilled size={16} />
                            </ThemeIcon>
                        </Tooltip>
                    )}
                    <CopyButton value={publicKey} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                                <ActionIcon color={copied ? primaryColor : "gray"} variant="light" radius="md" onClick={copy} mr={10}>
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Flex>
            }
            value={publicKey}
            readOnly
            classNames={containedInputClasses}
            size="md"
        />
    );
}
