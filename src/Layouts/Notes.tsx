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
    usersMetadata: UserMetadata[];
    loading: boolean;
    interactionStats: { [noteId: string]: InteractionStats };
    trimmed: boolean;
    loadNotes: () => void;
    reloadNotes: () => void;
}

export default function Notes({ notes, usersMetadata, loading, interactionStats, trimmed, loadNotes, reloadNotes }: NotesProps) {
    const { color } = useAppSelector((state) => state.primaryColor);
    const hasNotes = notes.length > 0;

    return (
        <>
            {!hasNotes && !loading && <Empty icon={<IconNoteOff size={30} />} text="No notes to display..." />}

            {trimmed && !loading && (
                <>
                    <Center>
                        <Button
                            color={color}
                            variant="filled"
                            m="xs"
                            radius="xl"
                            leftSection={<IconReload size={22} />}
                            size="md"
                            onClick={reloadNotes}
                        >
                            Reload
                        </Button>
                    </Center>
                    <Divider />
                </>
            )}

            {hasNotes &&
                notes.map((note: NostrEvent) => (
                    <NoteItem key={note.id} note={note} usersMetadata={usersMetadata} interactionStats={interactionStats} />
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
