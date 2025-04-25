import { useMemo } from "react";

import { Group, ActionIcon, Text, NumberFormatter, useMantineTheme } from "@mantine/core";
import { IconBolt, IconHeart, IconRepeat, IconBookmark, IconHeartFilled, IconMessageCircle } from "@tabler/icons-react";

import { useAppSelector } from "../../Store/hook";
import { InteractionStats } from "../../Types/interactionStats";

interface NoteFooterProps {
    noteId: string;
    interactionStats: { [noteId: string]: InteractionStats };
    handleActionIconClick: (event: React.MouseEvent) => void;
}

export default function NoteFooter({ noteId, interactionStats, handleActionIconClick }: NoteFooterProps) {
    const interactionsStats = useMemo(() => interactionStats[noteId] || null, [interactionStats, noteId]);
    const loggedInUser = useAppSelector((state) => state.user);
    const theme = useMantineTheme();

    const actionProps = {
        variant: "subtle" as const,
        radius: "xl" as const,
        pos: "relative" as const,
        size: 32,
    };

    const badgeStyle: React.CSSProperties = {
        position: "absolute",
        left: 28,
        top: 7,
        pointerEvents: "none",
    };

    const { liked, likedColor } = useMemo(() => {
        return { liked: interactionsStats.likePubkeys.includes(loggedInUser.publicKey), likedColor: theme.colors.pink[6] };
    }, [interactionsStats.likePubkeys, loggedInUser.publicKey]);

    return (
        <Group justify="space-between" pl="sm" mt="sm">
            <ActionIcon aria-label="comments" {...actionProps} onClick={handleActionIconClick} style={{ overflow: "visible" }}>
                <IconMessageCircle size={18} color="gray" />
                {interactionsStats.comments > 0 && (
                    <Text fz={12} c="dimmed" style={badgeStyle}>
                        <NumberFormatter value={interactionsStats.comments} thousandSeparator />
                    </Text>
                )}
            </ActionIcon>

            <ActionIcon aria-label="zap-amount" {...actionProps} onClick={handleActionIconClick} style={{ overflow: "visible" }}>
                <IconBolt size={18} color="gray" />
                {interactionsStats.zapAmount > 0 && (
                    <Text fz={12} c="dimmed" style={badgeStyle}>
                        <NumberFormatter value={interactionsStats.zapAmount} thousandSeparator />
                    </Text>
                )}
            </ActionIcon>

            <ActionIcon
                aria-label="likes"
                color={liked ? likedColor : "gray"}
                {...actionProps}
                onClick={handleActionIconClick}
                style={{ overflow: "visible" }}
            >
                {liked ? <IconHeartFilled size={18} color={likedColor} /> : <IconHeart size={18} color="gray" />}
                {interactionsStats.likes > 0 && (
                    <Text fz={12} c={liked ? likedColor : "dimmed"} style={badgeStyle}>
                        <NumberFormatter value={interactionsStats.likes} thousandSeparator />
                    </Text>
                )}
            </ActionIcon>

            <ActionIcon aria-label="reposts" {...actionProps} onClick={handleActionIconClick} style={{ overflow: "visible" }}>
                <IconRepeat size={18} color="gray" />
                {interactionsStats.reposts > 0 && (
                    <Text fz={12} c="dimmed" style={badgeStyle}>
                        <NumberFormatter value={interactionsStats.reposts} thousandSeparator />
                    </Text>
                )}
            </ActionIcon>

            <ActionIcon aria-label="bookmarks" {...actionProps} onClick={handleActionIconClick} style={{ overflow: "visible" }}>
                <IconBookmark size={18} color="gray" />
            </ActionIcon>
        </Group>
    );
}
