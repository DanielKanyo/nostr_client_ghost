import { useDispatch } from "react-redux";

import {
    CheckIcon,
    ColorSwatch,
    Container,
    Divider,
    Flex,
    Switch,
    Text,
    Tooltip,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

import PageTitle from "../../Components/PageTitle";
import Content from "../../Layouts/Content";
import MainBox from "../../Layouts/MainBox";
import SideBox from "../../Layouts/SideBox";
import { updatePrimaryColor } from "../../Store/Features/primaryColorSlice";
import { useAppSelector } from "../../Store/hook";

interface Color {
    id: string;
    color: string;
}

const colors: Color[] = [
    {
        color: "#9c36b5",
        id: "grape",
    },
    {
        color: "#6741d9",
        id: "violet",
    },
    {
        color: "#3b5bdb",
        id: "indigo",
    },
    {
        color: "#1971c2",
        id: "blue",
    },
    {
        color: "#0c8599",
        id: "cyan",
    },
    {
        color: "#099268",
        id: "teal",
    },
    {
        color: "#f08c00",
        id: "yellow",
    },
    {
        color: "#e8590c",
        id: "orange",
    },
];

export default function AppearanceSettings() {
    const primaryColor = useAppSelector((state) => state.primaryColor);
    const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
    const dispatch = useDispatch();

    const handlePrimaryColorChange = (colorId: string) => {
        localStorage.setItem("nostrPrimaryColor", colorId);
        dispatch(updatePrimaryColor(colorId));
    };

    return (
        <Content>
            <MainBox width={680}>
                <PageTitle title="Appearance Settings" withBackwards />
                <Container p="lg">
                    <Flex justify="space-between" align="center">
                        <Text fz={20}>Theme</Text>
                        <Tooltip label="Toggle Color Scheme" radius="md" withArrow>
                            <Switch
                                size="xl"
                                color={primaryColor}
                                onLabel={<IconSun size={22} />}
                                offLabel={<IconMoon size={22} />}
                                onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
                            />
                        </Tooltip>
                    </Flex>
                </Container>
                <Divider />
                <Container p="lg">
                    <Flex justify="space-between" align="center">
                        <Text fz={20}>Primary Color</Text>
                        <Flex gap={6}>
                            {colors.map((c) => (
                                <ColorSwatch
                                    key={c.id}
                                    withShadow={false}
                                    radius={32}
                                    size={32}
                                    component="button"
                                    color={c.color}
                                    onClick={() => handlePrimaryColorChange(c.id)}
                                    style={{ color: "#fff", cursor: "pointer" }}
                                >
                                    {primaryColor === c.id && <CheckIcon size={12} />}
                                </ColorSwatch>
                            ))}
                        </Flex>
                    </Flex>
                </Container>
                <Divider />
            </MainBox>
            <SideBox width={320}>Side Box</SideBox>
        </Content>
    );
}
