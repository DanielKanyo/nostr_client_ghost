import { NostrEvent } from "nostr-tools";

import { Button, Center, Container, Divider, Loader } from "@mantine/core";
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
    const { displayStartIndex } = useAppSelector((state) => state.noteData);
    const { color } = useAppSelector((state) => state.primaryColor);
    const hasNotes = notes.length > 0;

    if (!hasNotes && !loading) {
        return <Empty icon={<IconNoteOff size={30} />} text="No notes to display..." />;
    }

    return (
        <>
            {displayStartIndex > 0 && reloadNotes && (
                <>
                    <Center>
                        <Button
                            color={color}
                            variant="filled"
                            m="xs"
                            radius="xl"
                            leftSection={<IconReload size={22} />}
                            size="md"
                            onClick={() => reloadNotes()}
                        >
                            Reload
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
                <Container m="xs" p={0}>
                    <Button
                        variant="subtle"
                        color="gray"
                        radius="md"
                        onClick={() => loadNotes()}
                        loading={loading}
                        loaderProps={{ type: "dots" }}
                        fullWidth
                    >
                        <IconDots />
                    </Button>
                </Container>
            )}
        </>
    );
}
