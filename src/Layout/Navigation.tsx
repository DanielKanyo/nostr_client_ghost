import { useState } from "react";
import { Link } from "react-router-dom";

import { Avatar, Button, Container, Flex } from "@mantine/core";
import { IconHome, IconSettings, IconBell, IconMail, IconGhost } from "@tabler/icons-react";

import { UserMetadata } from "../Service/service";

const navItems = [
    { icon: IconHome, label: "Home", to: "/home" },
    { icon: IconBell, label: "Notifications", to: "/notifications" },
    { icon: IconMail, label: "Messages", to: "/messages" },
    { icon: IconSettings, label: "Settings", to: "/home/settings" },
];

interface NavigationProps {
    userMetadata: UserMetadata | null;
}

export default function Navigation({ userMetadata }: NavigationProps) {
    const [active, setActive] = useState(0);

    const items = navItems.map((item, index) => (
        <Button
            justify="flex-start"
            key={index}
            size="xl"
            fullWidth
            component={Link}
            to={item.to}
            variant={active === index ? "filled" : "subtle"}
            color={active === index ? "violet" : "gray"}
            radius="xl"
            leftSection={<item.icon size={25} style={{ marginRight: 6 }} />}
            onClick={() => setActive(index)}
            mb="xs"
        >
            {item.label}
        </Button>
    ));

    return (
        <Flex direction="column" justify="space-between" h="100%">
            <Container m={0} p={0}>
                <Button
                    justify="flex-start"
                    size="xl"
                    variant="subtle"
                    color="gray"
                    leftSection={<IconGhost size={28} style={{ marginRight: 6 }} />}
                    mb="xl"
                    style={{ pointerEvents: "none" }}
                >
                    _ghost
                </Button>
                {items}
            </Container>
            {userMetadata && (
                <Button
                    justify="flex-start"
                    size="xl"
                    radius="xl"
                    variant="subtle"
                    color="gray"
                    leftSection={<Avatar src={userMetadata.picture} size={40} style={{ marginRight: 6 }} />}
                >
                    {userMetadata.display_name}
                </Button>
            )}
        </Flex>
    );
}
