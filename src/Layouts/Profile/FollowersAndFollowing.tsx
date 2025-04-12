import { Flex, Button, NumberFormatter, Text, Modal, Tabs, MantineColor, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useAppSelector } from "../../Store/hook";
import classes from "./tabs.module.css";

interface FollowersAndFollowing {
    followers: string[];
    following: string[];
}

export default function FollowersAndFollowing({ followers, following }: FollowersAndFollowing) {
    const [opened, { open, close }] = useDisclosure(false);
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;

    const countStyle = { fontSize: 14, fontWeight: 700 };
    const buttonProps = {
        variant: "light" as const,
        color: "gray",
        size: "xs" as const,
        radius: "xl" as const,
    };

    return (
        <>
            <Flex gap="xs">
                <Button {...buttonProps}>
                    <Text style={countStyle}>
                        <NumberFormatter thousandSeparator value={followers.length} />{" "}
                    </Text>
                    <Text ml={6} fz={14} c="dimmed" onClick={open}>
                        Followers
                    </Text>
                </Button>
                <Button {...buttonProps}>
                    <Text style={countStyle}>
                        <NumberFormatter thousandSeparator value={following.length} />{" "}
                    </Text>
                    <Text ml={6} fz={14} c="dimmed">
                        Following
                    </Text>
                </Button>
            </Flex>

            <Modal
                title="Followers and Following"
                opened={opened}
                onClose={close}
                centered
                overlayProps={{ blur: 3 }}
                padding="lg"
                radius="lg"
                size="lg"
                classNames={classes}
            >
                <Tabs radius="lg" defaultValue="followers" color={primaryColor}>
                    <Tabs.List grow>
                        <Tabs.Tab value="followers">Followers</Tabs.Tab>
                        <Tabs.Tab value="following">Following</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="followers">
                        <ScrollArea h={600} overscrollBehavior="contain" scrollbarSize={6}>
                            TODO: Display followers
                        </ScrollArea>
                    </Tabs.Panel>

                    <Tabs.Panel value="following">
                        <ScrollArea h={600} overscrollBehavior="contain" scrollbarSize={6}>
                            TODO: Display Following
                        </ScrollArea>
                    </Tabs.Panel>
                </Tabs>
            </Modal>
        </>
    );
}
