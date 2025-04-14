import { Link } from "react-router-dom";

import { Container, Divider, NavLink, Text } from "@mantine/core";
import { IconBrush, IconChevronRight, IconKey, IconUserCog } from "@tabler/icons-react";

import PageTitle from "../Components/PageTitle";
import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import SideContainer from "../Layouts/SideContainer";
import { ROUTES } from "../Routes/routes";

const settingsItems = [
    { icon: IconKey, label: "Key Management", to: ROUTES.SETTINGS_KEY_MANAGEMENT },
    { icon: IconBrush, label: "Appearance", to: ROUTES.SETTINGS_APPEARANCE },
    { icon: IconUserCog, label: "Profile", to: ROUTES.SETTINGS_PROFILE },
];

export default function Settings() {
    const items = settingsItems.map((item, index) => (
        <Container key={index} p={0} m={0}>
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
        <Content>
            <MainContainer width={680}>
                <PageTitle title="Settings" withBackBtn />
                {items}
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
