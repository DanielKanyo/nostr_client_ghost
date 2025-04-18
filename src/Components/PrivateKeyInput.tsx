import { ActionIcon, CopyButton, CSSProperties, Flex, PasswordInput, ThemeIcon, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconInfoSquareRounded } from "@tabler/icons-react";

import containedInputClasses from "../Shared/Styles/containedInput.module.css";
import { useAppSelector } from "../Store/hook";

interface PrivateKeyInput {
    privateKey: string;
}

export default function PrivateKeyInput({ privateKey }: PrivateKeyInput) {
    const { color, borderColor } = useAppSelector((state) => state.primaryColor);

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
                            <IconInfoSquareRounded size={17} />
                        </ThemeIcon>
                    </Tooltip>
                    <CopyButton value={privateKey} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                                <ActionIcon color={copied ? color : "gray"} variant="light" radius="md" onClick={copy} mr={10}>
                                    {copied ? <IconCheck size={17} /> : <IconCopy size={17} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Flex>
            }
            value={privateKey}
            readOnly
            classNames={containedInputClasses}
            size="md"
            style={{ "--input-border-color-focus": borderColor } as CSSProperties}
        />
    );
}
