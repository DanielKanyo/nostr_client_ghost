import { ElementType } from "react";

import { Flex, Text } from "@mantine/core";

interface PageTitleProps {
    title: string;
    icon: ElementType<{ size?: number }>;
}

export default function PageTitle({ title, icon: Icon }: PageTitleProps) {
    return (
        <Flex p="lg" align="center" justify="center">
            <Icon size={30} />
            <Text ml={10} fz={26}>
                {title}
            </Text>
        </Flex>
    );
}
