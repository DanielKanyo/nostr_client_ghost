import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { SimplePool } from "nostr-tools";

import { Alert, Button, Container, Group } from "@mantine/core";
import { IconExclamationCircle, IconPencilCheck } from "@tabler/icons-react";

import AccountForm from "../../Components/AccountForm";
import PageTitle from "../../Components/PageTitle";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import ScrollContainer from "../../Layouts/ScrollContainer";
import SideContainer from "../../Layouts/SideContainer";
import { closePool, fetchUserMetadata, publishProfile } from "../../Services/userService";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH, HIDE_ALERT_TIMEOUT_IN_MS } from "../../Shared/utils";
import { updateUserProfile } from "../../Store/Features/userSlice";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";

export default function ProfileSettings() {
    const user = useAppSelector((state) => state.user);
    const { color } = useAppSelector((state) => state.primaryColor);
    const [name, setName] = useState<string | undefined>(user?.profile?.name);
    const [displayName, setDisplayName] = useState<string | undefined>(user?.profile?.display_name);
    const [website, setWebsite] = useState<string | undefined>(user?.profile?.website);
    const [picture, setPicture] = useState<string | undefined>(user?.profile?.picture);
    const [banner, setBanner] = useState<string | undefined>(user?.profile?.banner);
    const [about, setAbout] = useState<string | undefined>(user?.profile?.about);
    const [error, setError] = useState<string>("");
    const [warning, setWarning] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const privateKey = user.privateKey;
    const dispatch = useDispatch();

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
                    dispatch(updateUserProfile(metadata));
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Account update failed...");
        } finally {
            closePool(pool);
            setLoading(false);
        }
    };

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Profile Settings" withBackBtn />
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
                        <Group my="lg" justify="flex-end">
                            <Button
                                variant="filled"
                                color={color}
                                radius="xl"
                                leftSection={<IconPencilCheck size={21} />}
                                disabled={!displayName || !name || loading}
                                onClick={handleSave}
                                loading={loading}
                                loaderProps={{ type: "dots" }}
                                size="md"
                            >
                                Save
                            </Button>
                        </Group>
                    </Container>
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
