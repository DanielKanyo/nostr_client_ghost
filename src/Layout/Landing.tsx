import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, Card, Center, Flex, Loader, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useAuth } from "../Auth/AuthProvider";
import LoginModal from "../Component/LoginModal";
import { LoadingStateEnum } from "../Util/util";

export default function Landing() {
    const { loadingState } = useAuth();
    const [navigationState, setNavigationState] = useState<boolean>(false);
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (loadingState === LoadingStateEnum.IDLE) {
            setNavigationState(true);
            navigate("/home");
        }
    }, [loadingState]);

    if (loadingState === LoadingStateEnum.LOADING || navigationState) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
            </Center>
        );
    }

    return (
        <>
            <Center style={{ height: "100vh" }}>
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
            </Center>

            <LoginModal opened={opened} close={close} />
        </>
    );
}
