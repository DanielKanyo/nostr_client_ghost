import { useNavigate } from "react-router-dom";

import { ActionIcon, Flex, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

interface PageTitleProps {
    title: string;
    withBackwards?: boolean;
}

export default function PageTitle({ title, withBackwards }: PageTitleProps) {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <Flex p="lg" align="center" justify="flex-start">
            {withBackwards && (
                <ActionIcon mr={14} variant="subtle" color="gray" size="xl" radius="md" aria-label="back" onClick={goBack}>
                    <IconChevronLeft className="mantine-rotate-rtl" />
                </ActionIcon>
            )}
            <Text fz={26}>{title}</Text>
        </Flex>
    );
}
