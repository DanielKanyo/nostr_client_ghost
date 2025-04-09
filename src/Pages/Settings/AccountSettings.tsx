import { useEffect, useState } from "react";

import { nip19 } from "nostr-tools";

import { ActionIcon, Alert, Container, CopyButton, PasswordInput, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconInfoCircle } from "@tabler/icons-react";

import PageTitle from "../../Components/PageTitle";
import Content from "../../Layouts/Content";
import MainBox from "../../Layouts/MainBox";
import SideBox from "../../Layouts/SideBox";
import { useAppSelector } from "../../Store/hook";

export default function AccountSettings() {
    const primaryColor = useAppSelector((state) => state.primaryColor);
    const [privateKey, setPrivateKey] = useState<string>("");
    const [npub, setNpub] = useState<string>("");

    useEffect(() => {
        const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
        const storedPublicKey = localStorage.getItem("nostrPublicKey");

        if (storedPrivateKey && storedPublicKey) {
            setPrivateKey(storedPrivateKey);
            setNpub(nip19.npubEncode(storedPublicKey));
        }
    });

    return (
        <Content>
            <MainBox width={680}>
                <PageTitle title="Account Settings" withBackwards />
                <Container mx={0} px="lg">
                    <Alert variant="light" color={primaryColor} radius="md" icon={<IconInfoCircle />}>
                        You can improve your account security by installing a Nostr browser extension, like{" "}
                        <a
                            href="https://getalby.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: `var(--mantine-color-${primaryColor}-3)` }}
                        >
                            Alby
                        </a>
                        . By storing your Nostr private key within a browser extension, you will be able to securely sign into any Nostr web
                        app, including Ghost.
                    </Alert>

                    <TextInput
                        variant="filled"
                        mt="xl"
                        size="md"
                        radius="md"
                        label="Public Key"
                        description="Anyone on Nostr can find you via your public key. Feel free to share anywhere."
                        rightSection={
                            <CopyButton value={npub} timeout={2000}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                                        <ActionIcon color={copied ? primaryColor : "gray"} variant="light" radius="md" onClick={copy}>
                                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        }
                        value={npub}
                        readOnly
                    />
                    <PasswordInput
                        variant="filled"
                        mt="lg"
                        size="md"
                        radius="md"
                        label="Private Key"
                        description="This key fully controls your Nostr account. Don't share it with anyone. Only copy this key to store it securely or to login to another Nostr app."
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
                </Container>
            </MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
