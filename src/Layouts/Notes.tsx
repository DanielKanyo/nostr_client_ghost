import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { NostrEvent, SimplePool } from "nostr-tools";

import { Button, Center, Container, Loader } from "@mantine/core";
import { IconDots, IconNoteOff } from "@tabler/icons-react";

import Empty from "../Components/Empty";
import NoteItem from "../Components/NoteItem";
import { fetchNotes } from "../Services/noteService";
import { fetchMultipleUserMetadata } from "../Services/userService";
import { DEFAULT_NUM_OF_DISPLAYED_NOTES, NoteFilterOptions } from "../Shared/utils";
import { UserMetadata } from "../Types/userMetadata";

interface NotesProps {
    pubkeys: string[];
    filterOptions: NoteFilterOptions;
}

export default function Notes({ pubkeys, filterOptions }: NotesProps) {
    const { nprofile } = useParams<{ nprofile: string }>();
    const [notes, setNotes] = useState<NostrEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [until, setUntil] = useState<number | undefined>(undefined);
    const [usersMetadata, setUsersMetadata] = useState<UserMetadata[]>([]);
    const limit = DEFAULT_NUM_OF_DISPLAYED_NOTES;

    useEffect(() => {
        setNotes([]);
        setUntil(undefined);
    }, [nprofile]);

    const loadNotes = async (reset: boolean = false) => {
        setLoading(true);

        const pool = new SimplePool();

        try {
            const newNotes = await fetchNotes(pool, pubkeys, limit, filterOptions, reset ? undefined : until);

            if (newNotes.length > 0) {
                const metadataMap = await fetchMultipleUserMetadata(pool, pubkeys);

                setUsersMetadata(Array.from(metadataMap.values()));
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
            {notes.length === 0 && !loading && <Empty icon={<IconNoteOff size={30} />} text="No notes to display..." />}

            {notes.map((note) => (
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
