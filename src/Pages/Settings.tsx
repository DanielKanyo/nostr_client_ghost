import { Link } from "react-router-dom";

import { Container, Divider, NavLink, Text } from "@mantine/core";
import { IconUserCog, IconBrush, IconSettings, IconChevronRight } from "@tabler/icons-react";

import PageTitle from "../Components/PageTitle";
import Content from "../Layouts/Content";
import MainBox from "../Layouts/MainBox";
import SideBox from "../Layouts/SideBox";
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
        <Content>
            <MainBox width={680}>
                <PageTitle title="Settings" icon={IconSettings} />
                {items}
            </MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
