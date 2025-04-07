import { Button, Card, Center, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import LoginModal from "../Components/LoginModal";

export default function GetStarted() {
    const [opened, { open, close }] = useDisclosure(false);

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
                        <Button variant="filled" radius="md" color="violet" mt="lg">
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
