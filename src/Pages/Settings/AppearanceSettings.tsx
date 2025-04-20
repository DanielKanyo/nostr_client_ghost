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
    useMantineTheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

import PageTitle from "../../Components/PageTitle";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import SideContainer from "../../Layouts/SideContainer";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../../Shared/utils";
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
    const { color } = useAppSelector((state) => state.primaryColor);
    const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
    const dispatch = useDispatch();
    const theme = useMantineTheme();

    const handlePrimaryColorChange = (colorId: string) => {
        localStorage.setItem("nostrPrimaryColor", colorId);

        dispatch(updatePrimaryColor({ color: colorId, borderColor: theme.colors[colorId]?.[5] }));
    };

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Appearance Settings" withBackBtn />
                <Container p="lg" m={0}>
                    <Flex justify="space-between" align="center">
                        <Text>Theme</Text>
                        <Tooltip label="Toggle Color Scheme" radius="md" withArrow>
                            <Switch
                                size="xl"
                                color={color}
                                onLabel={<IconSun size={22} />}
                                offLabel={<IconMoon size={22} />}
                                onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
                            />
                        </Tooltip>
                    </Flex>
                </Container>
                <Divider />
                <Container p="lg" m={0}>
                    <Flex justify="space-between" align="center">
                        <Text>Primary Color</Text>
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
                                    {color === c.id && <CheckIcon size={12} />}
                                </ColorSwatch>
                            ))}
                        </Flex>
                    </Flex>
                </Container>
                <Divider />
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
