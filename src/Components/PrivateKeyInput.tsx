import { PasswordInput, CopyButton, Tooltip, ActionIcon, MantineColor, Flex, ThemeIcon } from "@mantine/core";
import { IconCheck, IconCopy, IconInfoSquareRoundedFilled } from "@tabler/icons-react";

import containedInputClasses from "../Shared/Styles/containedInput.module.css";
import { useAppSelector } from "../Store/hook";

interface PrivateKeyInput {
    privateKey: string;
}

export default function PrivateKeyInput({ privateKey }: PrivateKeyInput) {
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;

    return (
        <PasswordInput
            mt="lg"
            radius="md"
            label="Private Key"
            rightSection={
                <Flex gap="xs">
                    <Tooltip
                        label="This key fully controls your Nostr account. Don't share it with anyone. Copy this key and store it securely!"
                        withArrow
                        multiline
                        w={300}
                    >
                        <ThemeIcon variant="light" radius="md" color="gray">
                            <IconInfoSquareRoundedFilled size={16} />
                        </ThemeIcon>
                    </Tooltip>
                    <CopyButton value={privateKey} timeout={2000}>
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
            value={privateKey}
            readOnly
            classNames={containedInputClasses}
        />
    );
}
