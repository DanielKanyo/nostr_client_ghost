import { NostrEvent } from "nostr-tools";

import { Button, Center, Container, Loader } from "@mantine/core";
import { IconDots, IconNoteOff } from "@tabler/icons-react";

import Empty from "../Components/Empty";
import NoteItem from "../Components/Note/NoteItem";
import { UserMetadata } from "../Types/userMetadata";

interface NotesProps {
    notes: NostrEvent[];
    usersMetadata: UserMetadata[];
    loading: boolean;
    loadNotes: () => void;
}

export default function Notes({ notes, usersMetadata, loading, loadNotes }: NotesProps) {
    return (
        <>
            {notes.length === 0 && !loading && <Empty icon={<IconNoteOff size={30} />} text="No notes to display..." />}

            {notes.map((note: NostrEvent) => (
                <NoteItem key={note.id} note={note} usersMetadata={usersMetadata} />
            ))}
            {loading && (
                <Center>
                    <Loader size={36} my="md" color="var(--mantine-color-dark-0)" type="dots" />
                </Center>
            )}
            {notes.length > 0 && !loading && (
                <Container m="md" p={0}>
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
