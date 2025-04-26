import { useMemo } from "react";

import { NostrEvent } from "nostr-tools";

import { Box, Stack, Flex, Text } from "@mantine/core";

import { formatTimestamp } from "../../Shared/utils";
import { InteractionStats } from "../../Types/interactionStats";

const MAX_NUM_OF_POPULAR_NOTES = 6;

interface PopularNotesProps {
    notes: NostrEvent[];
    interactionStats: { [noteId: string]: InteractionStats };
}

export default function PopularNotes({ notes, interactionStats }: PopularNotesProps) {
    const popularNotes = useMemo(() => {
        if (!notes.length) {
            return [];
        }

        const notesWithPopularity = notes
            .map((note) => {
                const stats = interactionStats[note.id] || { likes: 0, reposts: 0, comments: 0, zapAmount: 0 };
                const popularityScore = stats.likes * 3 + stats.reposts * 5 + stats.comments * 4 + stats.zapAmount * 0.01;

                return { note, popularityScore };
            })
            .sort((a, b) => b.popularityScore - a.popularityScore)
            .slice(0, MAX_NUM_OF_POPULAR_NOTES)
            .map((item) => item.note);

        return notesWithPopularity;
    }, [notes, interactionStats]);

    return (
        <>
            {popularNotes.length > 0 && (
                <Box py="md" ml="md">
                    <Text mb="md">
                        Popular Notes
                    </Text>
                    <Stack ml="sm" gap="lg">
                        {popularNotes.map((pn) => (
                            <div key={pn.id}>
                                <Flex align="center" gap={5}>
                                    <Text c="dimmed" fz={13}>
                                        ·
                                    </Text>
                                    <Text c="dimmed" fz={13}>
                                        {formatTimestamp(pn.created_at * 1000)}
                                    </Text>
                                </Flex>
                                <Text fz={14} style={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }} lineClamp={2}>
                                    <div>{pn.content}</div>
                                </Text>
                            </div>
                        ))}
                    </Stack>
                </Box>
            )}
        </>
    );
}
