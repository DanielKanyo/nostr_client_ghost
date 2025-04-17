import { Group, ActionIcon } from "@mantine/core";
import { IconMessageCircle, IconBolt, IconHeart, IconRepeat, IconBookmark } from "@tabler/icons-react";

interface NoteActionsProps {
    handleActionIconClick: (event: React.MouseEvent) => void;
}

export default function NoteActions({ handleActionIconClick }: NoteActionsProps) {
    return (
        <Group justify="space-between" ml={-7}>
            <ActionIcon aria-label="comments" variant="subtle" size={32} color="gray" radius="xl" onClick={handleActionIconClick}>
                <IconMessageCircle size={18} color="gray" />
            </ActionIcon>
            <ActionIcon aria-label="comments" variant="subtle" size={32} color="gray" radius="xl" onClick={handleActionIconClick}>
                <IconBolt size={18} color="gray" />
            </ActionIcon>
            <ActionIcon aria-label="comments" variant="subtle" size={32} color="gray" radius="xl" onClick={handleActionIconClick}>
                <IconHeart size={18} color="gray" />
            </ActionIcon>
            <ActionIcon aria-label="comments" variant="subtle" size={32} color="gray" radius="xl" onClick={handleActionIconClick}>
                <IconRepeat size={18} color="gray" />
            </ActionIcon>
            <ActionIcon aria-label="comments" variant="subtle" size={32} color="gray" radius="xl" onClick={handleActionIconClick}>
                <IconBookmark size={18} color="gray" />
            </ActionIcon>
        </Group>
    );
}
