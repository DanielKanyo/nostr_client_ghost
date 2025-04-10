import { useLocation, Link } from "react-router-dom";

import { Avatar, Button, Container, Flex, MantineColor, Text } from "@mantine/core";
import { IconHome, IconSettings, IconBell, IconMail, IconGhost } from "@tabler/icons-react";

import { ROUTES } from "../Routes/routes";
import { useAppSelector } from "../Store/hook";

const navItems = [
    { icon: IconHome, label: "Home", to: ROUTES.HOME },
    { icon: IconBell, label: "Notifications", to: ROUTES.NOTIFICATIONS },
    { icon: IconMail, label: "Messages", to: ROUTES.MESSAGES },
    { icon: IconSettings, label: "Settings", to: ROUTES.SETTINGS },
];

export default function Navigation() {
    const user = useAppSelector((state) => state.user).data;
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;
    const location = useLocation();

    const activeRoute = Object.values(ROUTES).find((r) => location.pathname === r || location.pathname.startsWith(r + "/"));

    const items = navItems.map((item, index) => (
        <Button
            justify="flex-start"
            key={index}
            size="xl"
            fullWidth
            component={Link}
            to={item.to}
            variant={activeRoute === item.to ? "filled" : "subtle"}
            color={activeRoute === item.to ? primaryColor : "gray"}
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
                    radius="xl"
                    color="gray"
                    leftSection={<IconGhost size={28} style={{ marginRight: 6 }} />}
                    mb="xl"
                    component={Link}
                    to={ROUTES.HOME}
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
