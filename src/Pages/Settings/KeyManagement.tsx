import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Alert, Button, Container, Group, MantineColor } from "@mantine/core";
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
import { resetUser } from "../../Store/Features/userSlice";
import { useAppSelector } from "../../Store/hook";

export default function KeyManagement() {
    const user = useAppSelector((state) => state.user);
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;
    const privateKey = user.privateKey;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const npub = useMemo(() => encodeNPub(user.publicKey), [user.publicKey]);

    const handleLogout = () => {
        localStorage.removeItem("nostrPrivateKey");
        localStorage.removeItem("nostrPublicKey");

        dispatch(resetUser());
        navigate(ROUTES.HOME);
    };

    return (
        <Content>
            <MainContainer width={680}>
                <PageTitle title="Key Management" withBackBtn />
                <ScrollContainer>
                    <Container mx={0} px="lg" mt="lg">
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

                        <PublicKeyInput publicKey={npub} withLabels />
                        <PrivateKeyInput privateKey={privateKey} />
                        <Group my="lg" justify="flex-end">
                            <Button variant="filled" color="red" radius="xl" leftSection={<IconLogout2 size={21} />} onClick={handleLogout}>
                                Logout
                            </Button>
                        </Group>
                    </Container>
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
