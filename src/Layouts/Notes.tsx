import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { NostrEvent, SimplePool } from "nostr-tools";

import { Button, Center, Container, Loader, Text } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";

import NoteItem from "../Components/NoteItem";
import { fetchNotes } from "../Services/noteService";
import { DEFAULT_NUM_OF_DISPLAYED_NOTES } from "../Shared/utils";

interface NotesProps {
    pubkeys: string[];
}

export default function Notes({ pubkeys }: NotesProps) {
    const { nprofile } = useParams<{ nprofile: string }>();
    const [notes, setNotes] = useState<NostrEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [until, setUntil] = useState<number | undefined>(undefined);
    const limit = DEFAULT_NUM_OF_DISPLAYED_NOTES;

    useEffect(() => {
        setNotes([]);
        setUntil(undefined);
    }, [nprofile]);

    const loadNotes = async (reset: boolean = false) => {
        setLoading(true);

        const pool = new SimplePool();

        try {
            const newNotes = await fetchNotes(pool, pubkeys, limit, reset ? undefined : until);

            if (newNotes.length > 0) {
                setNotes((prev) => (reset ? newNotes : [...prev, ...newNotes]));
                // Set until to the timestamp of the oldest note for pagination
                setUntil(newNotes[newNotes.length - 1].created_at - 1);
            }
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pubkeys.length > 0) {
            loadNotes(true);
        }
    }, [nprofile]);

    return (
        <>
            {notes.length === 0 && !loading && (
                <Center>
                    <Text c="dimmed">No notes to display...</Text>
                </Center>
            )}

            {notes.map((note) => (
                <NoteItem key={note.id} note={note} />
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
