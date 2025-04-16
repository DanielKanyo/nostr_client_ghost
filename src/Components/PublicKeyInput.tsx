import { ActionIcon, CopyButton, Flex, TextInput, ThemeIcon, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconInfoSquareRounded } from "@tabler/icons-react";

import containedInputClasses from "../Shared/Styles/containedInput.module.css";
import { useAppSelector } from "../Store/hook";

interface PublicKeyInputProps {
    pubkey: string;
    withLabels: boolean;
}

export default function PublicKeyInput({ pubkey, withLabels }: PublicKeyInputProps) {
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
                                <IconInfoSquareRounded size={17} />
                            </ThemeIcon>
                        </Tooltip>
                    )}
                    <CopyButton value={pubkey} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                                <ActionIcon color={copied ? primaryColor : "gray"} variant="light" radius="md" onClick={copy} mr={10}>
                                    {copied ? <IconCheck size={17} /> : <IconCopy size={17} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Flex>
            }
            value={pubkey}
            readOnly
            classNames={containedInputClasses}
            size="md"
        />
    );
}
