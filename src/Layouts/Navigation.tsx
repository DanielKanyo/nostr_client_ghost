import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { Avatar, Box, Button, Container, Flex, Text } from "@mantine/core";
import { IconBell, IconBookmark, IconGhost, IconHome, IconMail, IconSettings } from "@tabler/icons-react";

import { PROFILE_ROUTE_BASE, ROUTES } from "../Routes/routes";
import { encodeNProfile } from "../Services/userService";
import { useAppSelector } from "../Store/hook";

const navItems = [
    { icon: IconHome, label: "Home", to: ROUTES.HOME },
    { icon: IconBell, label: "Notifications", to: ROUTES.NOTIFICATIONS },
    { icon: IconMail, label: "Messages", to: ROUTES.MESSAGES },
    { icon: IconBookmark, label: "Bookmarks", to: ROUTES.BOOKMARKS },
    { icon: IconSettings, label: "Settings", to: ROUTES.SETTINGS },
];

export default function Navigation() {
    const user = useAppSelector((state) => state.user);
    const { color } = useAppSelector((state) => state.primaryColor);
    const location = useLocation();

    const nprofile = useMemo(() => encodeNProfile(user.publicKey), [user.publicKey]);

    const activeRoute = useMemo(() => {
        return Object.values(ROUTES).find((r) => location.pathname === r || location.pathname.startsWith(r + "/"));
    }, [location.pathname]);

    const items = navItems.map((item, index) => (
        <Button
            justify="flex-start"
            key={index}
            size="xl"
            fullWidth
            component={Link}
            to={item.to}
            variant={activeRoute === item.to ? "filled" : "subtle"}
            color={activeRoute === item.to ? color : "gray"}
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
                to={`${PROFILE_ROUTE_BASE}/${nprofile}`}
                justify="flex-start"
                size="xl"
                radius={80}
                variant="subtle"
                color="gray"
                leftSection={<Avatar src={user?.profile?.picture} size={60} style={{ marginRight: 10, marginLeft: -10 }} />}
                h={80}
            >
                <Flex direction="column" align="flex-start" justify="center">
                    <Box w={150}>
                        <Text ta="left" size="xl" truncate="end">
                            {user ? user?.profile?.display_name : "Undefined"}
                        </Text>
                        <Text ta="left" c="dimmed" size="sm" lh={1.2} truncate="end">
                            @{user ? user.profile?.name : "Undefined"}
                        </Text>
                    </Box>
                </Flex>
            </Button>
        </Flex>
    );
}
