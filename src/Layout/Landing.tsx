import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Button, Card, Center, Flex, Loader, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import LoginModal from "../Component/LoginModal";
import { authUser, fetchUserMetadata } from "../Service/service";
import { LoadingStateEnum, LoadingStates } from "../Util/util";

export default function Landing() {
    const [loadingState, setLoadingState] = useState<LoadingStates>(LoadingStateEnum.LOADING);
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authUserAndFetchUserMetadata = async () => {
            const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
            const storedPublicKey = localStorage.getItem("nostrPublicKey");

            if (storedPrivateKey && storedPublicKey) {
                try {
                    const pool = new SimplePool();
                    const publicKey = await authUser(storedPrivateKey, pool);

                    if (publicKey === storedPublicKey) {
                        const metadata = await fetchUserMetadata(publicKey, pool);

                        if (metadata) {
                            setLoadingState(LoadingStateEnum.REDIRECTING);
                            navigate("/home");
                        }
                    }
                } catch {
                    console.log("Something went wrong...");
                }
            } else {
                setLoadingState(LoadingStateEnum.IDLE);
            }
        };

        authUserAndFetchUserMetadata();
    }, []);

    return (
        <>
            <Center style={{ height: "100vh" }}>
                {loadingState !== LoadingStateEnum.IDLE ? (
                    <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
                ) : (
                    <Flex direction="column" align="center">
                        <Text size="xl" mb="md">
                            Welcome To Ghost!
                        </Text>
                        <Card shadow="sm" padding="lg" radius="md" mb="md" w={500}>
                            <Text size="md" mt="lg">
                                New to Nostr? Create your account now and join the future of social media. It's quick and easy!
                            </Text>
                            <Button component={Link} to="/sign-up" variant="filled" radius="md" color="violet" mt="lg">
                                Create Account
                            </Button>
                            <Button variant="light" radius="md" color="gray" mt="sm" onClick={open}>
                                Login
                            </Button>
                        </Card>
                    </Flex>
                )}
            </Center>

            <LoginModal opened={opened} close={close} />
        </>
    );
}
