import { Group, Text } from "@mantine/core";

const MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

export const formatTimestamp = (timestamp: number): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();

    // Check if less than 1 hour (60 minutes)
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    }

    // Check if less than 24 hours
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
        return `${diffHours}h`;
    }

    // Check if same year
    const isSameYear = now.getFullYear() === date.getFullYear();
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();

    if (isSameYear) {
        return `${month} ${day}`;
    } else {
        const year = date.getFullYear();
        return `${year}, ${month} ${day}`;
    }
};

interface NoteHeaderProps {
    displayName: string;
    createdAt: number;
}

export default function NoteHeader({ displayName, createdAt }: NoteHeaderProps) {
    return (
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
    );
}
