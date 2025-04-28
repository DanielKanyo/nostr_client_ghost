import { useEffect, useState } from "react";

import { NostrEvent } from "nostr-tools";

import { Button, Center, Divider, Loader } from "@mantine/core";
import { IconDots, IconNoteOff, IconReload } from "@tabler/icons-react";

import Empty from "../Components/Empty";
import NoteItem from "../Components/Note/NoteItem";
import { useAppSelector } from "../Store/hook";
import { InteractionStats } from "../Types/interactionStats";
import { UserMetadata } from "../Types/userMetadata";

interface NotesProps {
    notes: NostrEvent[];
    replyDetails: NostrEvent[];
    usersMetadata: UserMetadata[];
    loading: boolean;
    interactionStats: { [noteId: string]: InteractionStats };
    loadNotes: () => void;
    reloadNotes?: () => void;
}

export default function Notes({ notes, replyDetails, usersMetadata, loading, interactionStats, loadNotes, reloadNotes }: NotesProps) {
    const { color } = useAppSelector((state) => state.primaryColor);
    const [showRefreshButton, setShowRefreshButton] = useState(false);
    const hasNotes = notes.length > 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRefreshButton(true);
        }, 60000);

        return () => clearTimeout(timer);
    }, [showRefreshButton]);

    if (!hasNotes && !loading) {
        return <Empty icon={<IconNoteOff size={30} />} text="No notes to display..." />;
    }

    const handleReloadNotes = () => {
        setShowRefreshButton(false);

        if (reloadNotes) {
            reloadNotes();
        }
    };

    return (
        <>
            {showRefreshButton && (
                <>
                    <Center>
                        <Button
                            color={color}
                            variant="filled"
                            m="xs"
                            radius="xl"
                            leftSection={<IconReload size={22} />}
                            size="md"
                            onClick={() => handleReloadNotes()}
                        >
                            Refresh
                        </Button>
                    </Center>
                    <Divider />
                </>
            )}

            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    replyDetails={replyDetails}
                    usersMetadata={usersMetadata}
                    interactionStats={interactionStats}
                />
            ))}

            {loading && (
                <Center>
                    <Loader size={36} my="xs" color="var(--mantine-color-dark-0)" type="dots" />
                </Center>
            )}
            {hasNotes && !loading && (
                <Center m="xs" p={0}>
                    <Button variant="subtle" color="gray" radius="md" onClick={() => loadNotes()} fullWidth>
                        <IconDots />
                    </Button>
                </Center>
            )}
        </>
    );
}
