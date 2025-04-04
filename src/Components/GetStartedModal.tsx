import { Link } from "react-router-dom";

import { Button, Flex, Modal, Text } from "@mantine/core";

interface GetStartedModalProps {
    opened: boolean;
    close: () => void;
}

export default function GetStartedModal({ opened, close }: GetStartedModalProps) {
    return (
        <Modal opened={opened} onClose={close} title="Get Started" centered overlayProps={{ blur: 3 }} padding="lg">
            <Flex direction="column">
                <Text>New to Nostr? Create your account now and join this magical place. It's quick and easy!</Text>
                <Button
                    variant="gradient"
                    radius="md"
                    color="violet"
                    my="lg"
                    gradient={{ from: "violet", to: "grape", deg: 65 }}
                    component={Link}
                    to="/sign-up"
                >
                    Create Account
                </Button>

                <Flex direction="row">
                    Already have a Nostr account?
                    <Text ml={6} component={Link} to="/sign-in" c="violet">
                        Login now
                    </Text>
                </Flex>
            </Flex>
        </Modal>
    );
}
