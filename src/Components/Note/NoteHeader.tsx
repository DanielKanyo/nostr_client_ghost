import { Group, ActionIcon, Text } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";

import { formatTimestamp } from "../../Shared/utils";

interface NoteHeaderProps {
    displayName: string;
    createdAt: number;
    handleMoreBtnClick: (event: React.MouseEvent) => void;
}

export default function NoteHeader({ displayName, createdAt, handleMoreBtnClick }: NoteHeaderProps) {
    return (
        <Group justify="space-between">
            <Group gap={5}>
                <Text size="md" fw={700}>
                    {displayName}
                </Text>
                <Text c="dimmed" size="lg">
                    ·
                </Text>
                <Text c="dimmed" size="md">
                    {formatTimestamp(createdAt * 1000)}
                </Text>
            </Group>
            <ActionIcon aria-label="dots" variant="subtle" size={28} color="gray" radius="xl" onClick={handleMoreBtnClick}>
                <IconDots size={18} color="gray" />
            </ActionIcon>
        </Group>
    );
}
