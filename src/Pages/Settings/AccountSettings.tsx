import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { nip19, SimplePool } from "nostr-tools";

import { ActionIcon, Alert, Button, Container, CopyButton, Group, MantineColor, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconDeviceFloppy, IconExclamationCircle, IconInfoCircle, IconLogout2 } from "@tabler/icons-react";

import AccountForm from "../../Components/Authentication/AccountForm";
import PageTitle from "../../Components/PageTitle";
import PrivateKeyInput from "../../Components/PrivateKeyInput";
import Content from "../../Layouts/Content";
import MainBox from "../../Layouts/MainBox";
import ScrollBox from "../../Layouts/ScrollBox";
import SideBox from "../../Layouts/SideBox";
import { ROUTES } from "../../Routes/routes";
import { closePool, fetchUserMetadata, publishProfile } from "../../Services/authService";
import { HIDE_ALERT_TIMEOUT_IN_MS } from "../../Shared/utils";
import { resetUser, updateUser } from "../../Store/Features/userSlice";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";

export default function AccountSettings() {
    const user = useAppSelector((state) => state.user).data;
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;
    const [name, setName] = useState<string | undefined>(user?.name);
    const [displayName, setDisplayName] = useState<string | undefined>(user?.display_name);
    const [website, setWebsite] = useState<string | undefined>(user?.website);
    const [picture, setPicture] = useState<string | undefined>(user?.picture);
    const [banner, setBanner] = useState<string | undefined>(user?.banner);
    const [about, setAbout] = useState<string | undefined>(user?.about);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [warning, setWarning] = useState<string>("");
    const [privateKey, setPrivateKey] = useState<string>("");
    const [npub, setNpub] = useState<string>("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
        const storedPublicKey = localStorage.getItem("nostrPublicKey");

        if (storedPrivateKey && storedPublicKey) {
            setPrivateKey(storedPrivateKey);
            setNpub(nip19.npubEncode(storedPublicKey));
        }
    });

    useEffect(() => {
        if (warning) {
            const timer = setTimeout(() => setWarning(""), HIDE_ALERT_TIMEOUT_IN_MS);
            return () => clearTimeout(timer);
        }
    }, [warning]);

    const handleSave = async () => {
        if (!displayName || !name) {
            setWarning("Please fill the required fields!");
            return;
        }

        setWarning("");
        setLoading(true);

        const metadataToStore: UserMetadata = { name, display_name: displayName, website, picture, banner, about };
        const pool = new SimplePool();
        const storedPublicKey = localStorage.getItem("nostrPublicKey");

        try {
            await publishProfile(pool, privateKey, metadataToStore);

            if (storedPublicKey) {
                const metadata = await fetchUserMetadata(pool, storedPublicKey);

                if (metadata) {
                    dispatch(updateUser(metadata));
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Account update failed...");
        } finally {
            closePool(pool);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("nostrPrivateKey");
        localStorage.removeItem("nostrPublicKey");

        dispatch(resetUser());
        navigate(ROUTES.HOME);
    };

    return (
        <Content>
            <MainBox width={680}>
                <PageTitle title="Account Settings" withBackwards />
                <ScrollBox>
                    <Container mx={0} px="lg">
                        <AccountForm
                            name={name ?? ""}
                            displayName={displayName ?? ""}
                            picture={picture ?? ""}
                            banner={banner ?? ""}
                            website={website ?? ""}
                            about={about ?? ""}
                            setName={setName}
                            setDisplayName={setDisplayName}
                            setPicture={setPicture}
                            setBanner={setBanner}
                            setWebsite={setWebsite}
                            setAbout={setAbout}
                        />
                        <Alert variant="light" color={primaryColor} radius="md" icon={<IconInfoCircle />} mt="lg">
                            You can improve your account security by installing a Nostr browser extension, like{" "}
                            <a
                                href="https://getalby.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: `var(--mantine-color-${primaryColor}-3)` }}
                            >
                                Alby
                            </a>
                            . By storing your Nostr private key within a browser extension, you will be able to securely sign into any Nostr
                            web app, including Ghost.
                        </Alert>

                        <TextInput
                            variant="filled"
                            mt="lg"
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
                        <PrivateKeyInput privateKey={privateKey} primaryColor={primaryColor} />
                        {error && (
                            <Alert
                                variant="light"
                                color="red"
                                radius="md"
                                title="Something went wrong!"
                                icon={<IconExclamationCircle />}
                                mt="lg"
                            >
                                {error}
                            </Alert>
                        )}
                        {warning && (
                            <Alert variant="light" color="orange" radius="md" title="Warning!" icon={<IconExclamationCircle />} mt="lg">
                                {warning}
                            </Alert>
                        )}
                        <Group gap="xs" my="lg" justify="space-between">
                            <Button variant="filled" color="red" radius="xl" leftSection={<IconLogout2 size={21} />} onClick={handleLogout}>
                                Logout
                            </Button>
                            <Button
                                variant="filled"
                                color={primaryColor}
                                radius="xl"
                                leftSection={<IconDeviceFloppy size={21} />}
                                disabled={!displayName || !name || loading}
                                onClick={handleSave}
                                loading={loading}
                                loaderProps={{ type: "dots" }}
                            >
                                Save
                            </Button>
                        </Group>
                    </Container>
                </ScrollBox>
            </MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
