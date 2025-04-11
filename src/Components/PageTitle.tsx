import { useNavigate } from "react-router-dom";

import { ActionIcon, Divider, Flex, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

interface PageTitleProps {
    title: string;
    withBackBtn?: boolean;
}

export default function PageTitle({ title, withBackBtn }: PageTitleProps) {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Flex p="lg" align="center" justify="flex-start">
                {withBackBtn && (
                    <ActionIcon mr={14} variant="subtle" color="gray" size="xl" radius="xl" aria-label="back" onClick={goBack}>
                        <IconChevronLeft className="mantine-rotate-rtl" />
                    </ActionIcon>
                )}
                <Text fz={22}>{title}</Text>
            </Flex>
            <Divider />
        </>
    );
}
