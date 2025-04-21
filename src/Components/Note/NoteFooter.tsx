import { useMemo } from "react";

import { Group, ActionIcon, Text, NumberFormatter } from "@mantine/core";
import { IconMessageCircle, IconBolt, IconHeart, IconRepeat, IconBookmark } from "@tabler/icons-react";

import { InteractionStats } from "../../Types/interactionStats";

interface NoteFooterProps {
    noteId: string;
    interactionStats: { [noteId: string]: InteractionStats };
    handleActionIconClick: (event: React.MouseEvent) => void;
}

const ACTION_ICONS: { Icon: React.FC<{ size: number; color: string }>; label: string; countKey?: keyof InteractionStats }[] = [
    { Icon: IconMessageCircle, label: "comments", countKey: "comments" },
    { Icon: IconBolt, label: "zaps", countKey: "zapAmount" },
    { Icon: IconHeart, label: "likes", countKey: "likes" },
    { Icon: IconRepeat, label: "reposts", countKey: "reposts" },
    { Icon: IconBookmark, label: "bookmarks" },
];

export default function NoteFooter({ noteId, interactionStats, handleActionIconClick }: NoteFooterProps) {
    const interactionsStats = useMemo(() => interactionStats[noteId] || null, [interactionStats, noteId]);

    const actionProps = {
        variant: "subtle" as const,
        color: "gray",
        radius: "xl" as const,
        pos: "relative" as const,
        size: 32,
    };

    return (
        <Group justify="space-between" pl="sm" mt="sm">
            {ACTION_ICONS.map(({ Icon, label, countKey }) => (
                <ActionIcon key={label} aria-label={label} {...actionProps} onClick={handleActionIconClick} style={{ overflow: "visible" }}>
                    <Icon size={18} color="gray" />
                    {countKey && interactionsStats?.[countKey] > 0 && (
                        <Text
                            fz={12}
                            c="dimmed"
                            style={{
                                position: "absolute",
                                left: 28,
                                top: 7,
                                pointerEvents: "none",
                            }}
                        >
                            <NumberFormatter value={interactionsStats[countKey]} thousandSeparator />
                        </Text>
                    )}
                </ActionIcon>
            ))}
        </Group>
    );
}
