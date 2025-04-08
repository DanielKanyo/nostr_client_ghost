import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

import { Avatar, Button, Container, Flex, Text } from "@mantine/core";
import { IconHome, IconSettings, IconBell, IconMail, IconGhost } from "@tabler/icons-react";

import { ROUTES } from "../Routes/routes";
import store from "../Store/store";

const navItems = [
    { icon: IconHome, label: "Home", to: ROUTES.HOME },
    { icon: IconBell, label: "Notifications", to: ROUTES.NOTIFICATIONS },
    { icon: IconMail, label: "Messages", to: ROUTES.MESSAGES },
    { icon: IconSettings, label: "Settings", to: ROUTES.SETTINGS },
];

export default function Navigation() {
    const user = useSelector((state: ReturnType<typeof store.getState>) => state.user).data;
    const location = useLocation();

    const activeIndex = navItems.findIndex((item) => location.pathname === item.to || location.pathname.startsWith(item.to + "/"));

    const items = navItems.map((item, index) => (
        <Button
            justify="flex-start"
            key={index}
            size="xl"
            fullWidth
            component={Link}
            to={item.to}
            variant={activeIndex === index ? "filled" : "subtle"}
            color={activeIndex === index ? "violet" : "gray"}
            radius="xl"
            leftSection={<item.icon size={25} style={{ marginRight: 6 }} />}
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
            <Button
                component={Link}
                to="/profile"
                justify="flex-start"
                size="xl"
                radius={80}
                variant="subtle"
                color="gray"
                leftSection={<Avatar src={user?.picture} size={60} style={{ marginRight: 10, marginLeft: -10 }} />}
                h={80}
            >
                <Flex direction="column" align="flex-start" justify="center">
                    <Text size="xl">{user ? user?.display_name : "Undefined"}</Text>
                    <Text c="dimmed" size="sm">
                        @{user ? user.name : "Undefined"}
                    </Text>
                </Flex>
            </Button>
        </Flex>
    );
}
