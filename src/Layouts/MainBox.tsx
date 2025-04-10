import { useMemo } from "react";

import { Box, useComputedColorScheme, useMantineTheme } from "@mantine/core";

type MainBoxProps = {
    children: React.ReactNode;
    width: number;
};

export default function MainBox({ children, width }: MainBoxProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");

    const borderColor = useMemo(() => {
        return computedColorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
    }, [computedColorScheme, theme.colors]);

    return (
        <Box
            w={width}
            style={{
                height: "100vh",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderRight: `1px solid ${borderColor}`,
                borderLeft: `1px solid ${borderColor}`,
            }}
        >
            {children}
        </Box>
    );
}
