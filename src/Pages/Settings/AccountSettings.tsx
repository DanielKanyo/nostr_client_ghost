import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { ActionIcon, Alert, Container, CopyButton, Flex, PasswordInput, Text, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconInfoCircle, IconUserCog } from "@tabler/icons-react";

import store from "../../Store/store";

export default function AccountSettings() {
    const user = useSelector((state: ReturnType<typeof store.getState>) => state.user).data;
    const [privateKey, setPrivateKey] = useState<string>("");

    useEffect(() => {
        const storedPrivateKey = localStorage.getItem("nostrPrivateKey");

        if (storedPrivateKey) {
            setPrivateKey(storedPrivateKey);
        }
    });

    return (
        <>
            <Flex p="lg" align="center" justify="center">
                <IconUserCog size={30} />
                <Text ml={10} fz={26}>
                    Account Settings
                </Text>
            </Flex>
            <Container mx="sm">
                <Alert variant="light" color="violet" radius="md" icon={<IconInfoCircle />}>
                    You can improve your account security by installing a Nostr browser extension, like{" "}
                    <a
                        href="https://getalby.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--mantine-color-violet-3)" }}
                    >
                        Alby
                    </a>
                    . By storing your Nostr private key within a browser extension, you will be able to securely sign into any Nostr web
                    app, including Ghost.
                </Alert>

                <TextInput
                    variant="filled"
                    mt="xl"
                    size="lg"
                    radius="md"
                    label="Public Key"
                    description="Anyone on Nostr can find you via your public key. Feel free to share anywhere."
                    rightSection={
                        <CopyButton value={user?.npub} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                                    <ActionIcon color={copied ? "violet" : "gray"} variant="light" radius="md" onClick={copy}>
                                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    }
                    value={user?.npub ?? ""}
                    readOnly
                />
                <PasswordInput
                    variant="filled"
                    mt="xl"
                    size="lg"
                    radius="md"
                    label="Private Key"
                    description="This key fully controls your Nostr account. Don't share it with anyone. Only copy this key to store it securely or to login to another Nostr app."
                    rightSection={
                        <CopyButton value={privateKey} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                                    <ActionIcon color={copied ? "violet" : "gray"} variant="light" radius="md" onClick={copy}>
                                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    }
                    value={privateKey}
                    readOnly
                />
            </Container>
        </>
    );
}
