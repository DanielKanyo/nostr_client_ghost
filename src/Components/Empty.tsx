import { ReactElement } from "react";

import { Center, Stack, Text } from "@mantine/core";

interface EmptyProps {
    text?: string;
    icon: ReactElement;
}

export default function Empty({ icon, text }: EmptyProps) {
    return (
        <Center mt="lg" style={{ opacity: 0.4 }}>
            <Stack align="center" gap="xs">
                {icon}
                <Text fz="md">{text}</Text>
            </Stack>
        </Center>
    );
}
