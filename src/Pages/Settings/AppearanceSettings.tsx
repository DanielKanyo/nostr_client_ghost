import { ColorPicker, Container, Divider, Flex, Switch, Text, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconBrush, IconMoon, IconSun } from "@tabler/icons-react";

import PageTitle from "../../Components/PageTitle";

export default function AppearanceSettings() {
    const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

    return (
        <>
            <PageTitle title="Appearance Settings" icon={IconBrush} />
            <Container p="lg">
                <Flex justify="space-between" align="center">
                    <Text fz={20}>Theme</Text>
                    <Tooltip label="Toggle Color Scheme" radius="md" withArrow>
                        <Switch
                            size="xl"
                            color="violet"
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
                    <ColorPicker
                        withPicker={false}
                        swatchesPerRow={5}
                        format="hex"
                        swatches={["#be4bdb", "#7950f2", "#4c6ef5", "#15aabf", "#12b886"]}
                    />
                </Flex>
            </Container>
            <Divider />
        </>
    );
}
