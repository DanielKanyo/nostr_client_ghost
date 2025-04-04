import { Button, Card, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import GetStartedModal from "../Components/GetStartedModal";

export default function Feed() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" mb="md">
                <Group justify="space-between">
                    <Text size="xl">Welcome To Ghost!</Text>
                    <Button
                        variant="gradient"
                        radius="md"
                        color="violet"
                        onClick={open}
                        gradient={{ from: "violet", to: "grape", deg: 65 }}
                    >
                        Get Started
                    </Button>
                </Group>
            </Card>
            <Card shadow="sm" padding="lg" radius="md">
                Feed comes here
            </Card>
            <GetStartedModal opened={opened} close={close} />
        </>
    );
}
