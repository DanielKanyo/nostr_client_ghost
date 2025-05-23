import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Alert, Button, Container, Group } from "@mantine/core";
import { IconInfoCircle, IconLogout2 } from "@tabler/icons-react";

import PageTitle from "../../Components/PageTitle";
import PrivateKeyInput from "../../Components/PrivateKeyInput";
import PublicKeyInput from "../../Components/PublicKeyInput";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import ScrollContainer from "../../Layouts/ScrollContainer";
import SideContainer from "../../Layouts/SideContainer";
import { ROUTES } from "../../Routes/routes";
import { encodeNPub } from "../../Services/userService";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../../Shared/utils";
import { resetUser } from "../../Store/Features/userSlice";
import { useAppSelector } from "../../Store/hook";

export default function KeyManagement() {
    const user = useAppSelector((state) => state.user);
    const { color } = useAppSelector((state) => state.primaryColor);
    const privateKey = user.privateKey;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const npub = useMemo(() => encodeNPub(user.publicKey), [user.publicKey]);

    const handleLogout = () => {
        // TODO: remove everything, reset everything in store
        localStorage.removeItem("nostrPrivateKey");
        localStorage.removeItem("nostrPublicKey");

        dispatch(resetUser());
        navigate(ROUTES.HOME);
    };

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Key Management" withBackBtn />
                <ScrollContainer>
                    <Container mx={0} px="lg" mt="lg">
                        <Alert variant="light" color={color} radius="md" icon={<IconInfoCircle />} mt="lg">
                            You can improve your account security by installing a Nostr browser extension, like{" "}
                            <a
                                href="https://getalby.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: `var(--mantine-color-${color}-3)` }}
                            >
                                Alby
                            </a>
                            . By storing your Nostr private key within a browser extension, you will be able to securely sign into any Nostr
                            web app, including Ghost.
                        </Alert>

                        <PublicKeyInput pubkey={npub} withLabels />
                        <PrivateKeyInput privateKey={privateKey} />
                        <Group my="lg" justify="flex-end">
                            <Button
                                variant="filled"
                                size="md"
                                color="red"
                                radius="xl"
                                leftSection={<IconLogout2 size={21} />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Group>
                    </Container>
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
