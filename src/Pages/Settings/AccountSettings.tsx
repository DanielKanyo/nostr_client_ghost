import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { nip19, SimplePool } from "nostr-tools";

import { Alert, Button, Container, Group, MantineColor } from "@mantine/core";
import { IconDeviceFloppy, IconExclamationCircle, IconInfoCircle, IconLogout2 } from "@tabler/icons-react";

import AccountForm from "../../Components/AccountForm";
import PageTitle from "../../Components/PageTitle";
import PrivateKeyInput from "../../Components/PrivateKeyInput";
import PublicKeyInput from "../../Components/PublicKeyInput";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import ScrollContainer from "../../Layouts/ScrollContainer";
import SideContainer from "../../Layouts/SideContainer";
import { ROUTES } from "../../Routes/routes";
import { closePool, fetchUserMetadata, publishProfile } from "../../Services/userService";
import { HIDE_ALERT_TIMEOUT_IN_MS } from "../../Shared/utils";
import { resetUser, updateUser } from "../../Store/Features/userSlice";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";

export default function AccountSettings() {
    const user = useAppSelector((state) => state.user);
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;
    const [name, setName] = useState<string | undefined>(user?.data?.name);
    const [displayName, setDisplayName] = useState<string | undefined>(user?.data?.display_name);
    const [website, setWebsite] = useState<string | undefined>(user?.data?.website);
    const [picture, setPicture] = useState<string | undefined>(user?.data?.picture);
    const [banner, setBanner] = useState<string | undefined>(user?.data?.banner);
    const [about, setAbout] = useState<string | undefined>(user?.data?.about);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [warning, setWarning] = useState<string>("");
    const privateKey = user.privateKey;
    const npub = nip19.npubEncode(user.publicKey);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            <MainContainer width={680}>
                <PageTitle title="Account Settings" withBackBtn />
                <ScrollContainer>
                    <Container mx={0} px="lg" mt="lg">
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

                        <PublicKeyInput publicKey={npub} primaryColor={primaryColor} withLabels />
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
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
