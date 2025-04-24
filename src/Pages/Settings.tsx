import { Link } from "react-router-dom";

import { Container, Divider, Flex, NavLink, Text } from "@mantine/core";
import { IconAntenna, IconBrush, IconChevronRight, IconKey, IconUserCog, IconUserOff } from "@tabler/icons-react";

import pkg from "../../package.json";
import PageTitle from "../Components/PageTitle";
import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import SideContainer from "../Layouts/SideContainer";
import { ROUTES } from "../Routes/routes";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../Shared/utils";

const settingsItems = [
    { icon: IconKey, label: "Key Management", to: ROUTES.SETTINGS_KEY_MANAGEMENT },
    { icon: IconUserCog, label: "Profile", to: ROUTES.SETTINGS_PROFILE },
    { icon: IconUserOff, label: "Muted Accounts", to: ROUTES.SETTINGS_MUTEDED_ACCOUNTS },
    { icon: IconAntenna, label: "Network", to: ROUTES.SETTINGS_NETWORK },
    { icon: IconBrush, label: "Appearance", to: ROUTES.SETTINGS_APPEARANCE },
];

export default function Settings() {
    const items = settingsItems.map((item, index) => (
        <Container key={index} p={0} m={0}>
            <NavLink
                component={Link}
                to={item.to}
                p="lg"
                label={<Text>{item.label}</Text>}
                leftSection={<item.icon size={21} />}
                rightSection={<IconChevronRight size={15} className="mantine-rotate-rtl" />}
            />
            <Divider />
        </Container>
    ));

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Settings" />
                {items}
                <Flex p="lg" justify="space-between">
                    <Text c="dimmed">Version</Text>
                    <Text c="dimmed" fw={700}>
                        {pkg.version}
                    </Text>
                </Flex>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
