import { useCallback, useEffect, useState } from "react";

import { NostrEvent, SimplePool } from "nostr-tools";

import { Tabs } from "@mantine/core";

import { fetchInteractionStats, fetchNotes } from "../../Services/noteService";
import { closePool, fetchMultipleUserMetadata } from "../../Services/userService";
import classes from "../../Shared/Styles/tabs.module.css";
import { DEFAULT_NUM_OF_DISPLAYED_ITEMS, NoteFilterOptions, PROFILE_CONTENT_TABS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import { InteractionStats } from "../../Types/interactionStats";
import { UserMetadata } from "../../Types/userMetadata";
import Notes from "../Notes";
import UserList from "../UserList";

interface ProfileContentProps {
    pubkey: string;
    activeTab: string | null;
    handleActiveTabChange: (value: PROFILE_CONTENT_TABS) => void;
    followers: string[];
    following: string[];
}

export default function ProfileContent({ pubkey, activeTab, followers, following, handleActiveTabChange }: ProfileContentProps) {
    const { color } = useAppSelector((state) => state.primaryColor);
    const relays = useAppSelector((state) => state.relays);
    const [notes, setNotes] = useState<NostrEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [usersMetadata, setUsersMetadata] = useState<UserMetadata[]>([]);
    const [interactionStats, setInteractionStats] = useState<{ [noteId: string]: InteractionStats }>({});
    const [until, setUntil] = useState<number | undefined>(undefined);

    const loadNotes = useCallback(
        async (reset = false) => {
            setLoading(true);
            const pool = new SimplePool();

            try {
                const fetchedNotes = await fetchNotes(
                    pool,
                    [pubkey],
                    DEFAULT_NUM_OF_DISPLAYED_ITEMS,
                    NoteFilterOptions.All,
                    reset ? undefined : until
                );

                if (fetchedNotes.length > 0) {
                    const metadataMap = await fetchMultipleUserMetadata(pool, [pubkey]);
                    const noteIds = fetchedNotes.map((note) => note.id);
                    const newInteractionCounts = await fetchInteractionStats(pool, noteIds, relays);

                    if (reset) {
                        setNotes(fetchedNotes);
                        setInteractionStats(newInteractionCounts);
                    } else {
                        setNotes((prev) => [...prev, ...fetchedNotes]);
                        setInteractionStats((prev) => ({ ...prev, ...newInteractionCounts }));
                    }

                    setUsersMetadata(Array.from(metadataMap.values()));
                    setUntil(fetchedNotes[fetchedNotes.length - 1].created_at - 1);
                }
            } catch (error) {
                console.error("Error loading notes:", error);
            } finally {
                closePool(pool);
                setLoading(false);
            }
        },
        [pubkey, relays, until]
    );

    useEffect(() => {
        setNotes([]);
        setUntil(undefined);
        loadNotes(true);
    }, [pubkey]);

    return (
        <Tabs
            radius="md"
            defaultValue={PROFILE_CONTENT_TABS.NOTES}
            color={color}
            classNames={classes}
            mt="lg"
            value={activeTab}
            onChange={(e) => handleActiveTabChange(e as PROFILE_CONTENT_TABS)}
            keepMounted={false}
        >
            <Tabs.List grow>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.NOTES}>Notes</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.REPLIES}>Replies</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWERS}>Followers</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWING}>Following</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="notes">
                <Notes
                    notes={notes.filter((note) => note.tags.every((tag) => tag[0] !== "e"))}
                    usersMetadata={usersMetadata}
                    loading={loading}
                    interactionStats={interactionStats}
                    loadNotes={loadNotes}
                />
            </Tabs.Panel>

            <Tabs.Panel value="replies">
                <Notes
                    notes={notes.filter((note) => note.tags.some((tag) => tag[0] === "e"))}
                    usersMetadata={usersMetadata}
                    loading={loading}
                    interactionStats={interactionStats}
                    loadNotes={loadNotes}
                />
            </Tabs.Panel>

            <Tabs.Panel value="followers">
                <UserList pubkeys={followers} />
            </Tabs.Panel>

            <Tabs.Panel value="following">
                <UserList pubkeys={following} />
            </Tabs.Panel>
        </Tabs>
    );
}
