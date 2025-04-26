import { Group, Text } from "@mantine/core";

import { formatTimestamp } from "../../Shared/utils";

interface NoteHeaderProps {
    displayName: string;
    createdAt: number;
}

export default function NoteHeader({ displayName, createdAt }: NoteHeaderProps) {
    return (
        <Group gap={8}>
            <Text size="md" fw={700}>
                {displayName}
            </Text>
            <Text c="dimmed">·</Text>
            <Text c="dimmed" size="md">
                {formatTimestamp(createdAt * 1000)}
            </Text>
        </Group>
    );
}
