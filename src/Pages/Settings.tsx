import { Link } from "react-router-dom";

import { Container, Divider, Flex, NavLink, Text } from "@mantine/core";
import { IconUserCog, IconBrush, IconSettings, IconChevronRight } from "@tabler/icons-react";

import { ROUTES } from "../Routes/routes";

const settingsItems = [
    { icon: IconUserCog, label: "Account", to: ROUTES.SETTINGS_ACCOUNT },
    { icon: IconBrush, label: "Appearance", to: ROUTES.SETTINGS_APPEARANCE },
];

export default function Settings() {
    const items = settingsItems.map((item, index) => (
        <Container key={index} p={0}>
            <NavLink
                component={Link}
                to={item.to}
                p="lg"
                label={<Text fz={20}>{item.label}</Text>}
                leftSection={<item.icon size={22} />}
                rightSection={<IconChevronRight size={15} className="mantine-rotate-rtl" />}
            />
            <Divider />
        </Container>
    ));

    return (
        <>
            <Flex p="lg" align="center" justify="center">
                <IconSettings size={30} />
                <Text ml={10} fz={26}>
                    Settings
                </Text>
            </Flex>
            {items}
        </>
    );
}
