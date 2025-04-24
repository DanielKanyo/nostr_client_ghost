import { NostrEvent } from "nostr-tools";

import { Button, Center, Container, Loader } from "@mantine/core";
import { IconDots, IconNoteOff } from "@tabler/icons-react";

import Empty from "../Components/Empty";
import NoteItem from "../Components/Note/NoteItem";
import { InteractionStats } from "../Types/interactionStats";
import { UserMetadata } from "../Types/userMetadata";

interface NotesProps {
    notes: NostrEvent[];
    replyDetails: NostrEvent[];
    usersMetadata: UserMetadata[];
    loading: boolean;
    interactionStats: { [noteId: string]: InteractionStats };
    loadNotes: () => void;
}

export default function Notes({ notes, replyDetails, usersMetadata, loading, interactionStats, loadNotes }: NotesProps) {
    const hasNotes = notes.length > 0;

    if (!hasNotes && !loading) {
        return <Empty icon={<IconNoteOff size={30} />} text="No notes to display..." />;
    }

    return (
        <>
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
