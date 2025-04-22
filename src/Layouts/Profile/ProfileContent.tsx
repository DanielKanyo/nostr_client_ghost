import { useCallback, useEffect, useState } from "react";

import { NostrEvent, SimplePool } from "nostr-tools";

import { Tabs } from "@mantine/core";

import { fetchInteractionStats, fetchNotes } from "../../Services/noteService";
import { closePool, fetchMultipleUserMetadata } from "../../Services/userService";
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
    const [replies, setReplies] = useState<NostrEvent[]>([]);

    const [loadingForNotes, setLoadingForNotes] = useState(true);
    const [loadingForReplies, setLoadingForReplies] = useState(true);

    const [interactionStatsForNotes, setInteractionStatsForNotes] = useState<{ [noteId: string]: InteractionStats }>({});
    const [interactionStatsForReplies, setInteractionStatsForReplies] = useState<{ [noteId: string]: InteractionStats }>({});

    const [untilForNotes, setUntilForNotes] = useState<number | undefined>(undefined);
    const [untilForReplies, setUntilForReplies] = useState<number | undefined>(undefined);

    const [usersMetadata, setUsersMetadata] = useState<UserMetadata[]>([]);

    const limit = DEFAULT_NUM_OF_DISPLAYED_ITEMS;

    const loadNotes = useCallback(
        async (reset = false) => {
            setLoadingForNotes(true);

            const pool = new SimplePool();

            try {
                const until = reset ? undefined : untilForNotes;
                const fetchedNotes = await fetchNotes(pool, [pubkey], limit, NoteFilterOptions.Notes, until);

                if (fetchedNotes.length > 0) {
                    const noteIds = fetchedNotes.map((note) => note.id);
                    const newInteractionStats = await fetchInteractionStats(pool, noteIds, relays);

                    if (reset) {
                        setNotes(fetchedNotes);
                        setInteractionStatsForNotes(newInteractionStats);
                    } else {
                        setNotes((prev) => [...prev, ...fetchedNotes]);
                        setInteractionStatsForNotes((prev) => ({ ...prev, ...newInteractionStats }));
                    }

                    setUntilForNotes(fetchedNotes[fetchedNotes.length - 1].created_at - 1);
                }
            } catch (error) {
                console.error("Error loading notes:", error);
            } finally {
                closePool(pool);
                setLoadingForNotes(false);
            }
        },
        [pubkey, relays, untilForNotes]
    );

    const loadReplies = useCallback(
        async (reset = false) => {
            setLoadingForReplies(true);

            const pool = new SimplePool();

            try {
                const until = reset ? undefined : untilForReplies;
                const fetchedReplies = await fetchNotes(pool, [pubkey], limit, NoteFilterOptions.Replies, until);

                if (fetchedReplies.length > 0) {
                    const noteIds = fetchedReplies.map((note) => note.id);
                    const newInteractionStats = await fetchInteractionStats(pool, noteIds, relays);

                    if (reset) {
                        setReplies(fetchedReplies);
                        setInteractionStatsForReplies(newInteractionStats);
                    } else {
                        setReplies((prev) => [...prev, ...fetchedReplies]);
                        setInteractionStatsForReplies((prev) => ({ ...prev, ...newInteractionStats }));
                    }

                    setUntilForReplies(fetchedReplies[fetchedReplies.length - 1].created_at - 1);
                }
            } catch (error) {
                console.error("Error loading replies:", error);
            } finally {
                closePool(pool);
                setLoadingForReplies(false);
            }
        },
        [pubkey, relays, untilForReplies]
    );

    useEffect(() => {
        setNotes([]);
        setReplies([]);
        setUntilForNotes(undefined);
        setUntilForReplies(undefined);

        const fetchUsersMetadata = async () => {
            const pool = new SimplePool();

            try {
                const [metadataMap] = await Promise.all([fetchMultipleUserMetadata(pool, [pubkey]), loadNotes(true), loadReplies(true)]);

                setUsersMetadata(Array.from(metadataMap.values()));
            } catch (error) {
                console.error("Error loading metadata:", error);
            } finally {
                closePool(pool);
            }
        };

        fetchUsersMetadata();
    }, [pubkey]);

    return (
        <Tabs
            radius="md"
            defaultValue={PROFILE_CONTENT_TABS.NOTES}
            color={color}
            mt="lg"
            value={activeTab}
            onChange={(e) => handleActiveTabChange(e as PROFILE_CONTENT_TABS)}
            keepMounted={false}
        >
            <Tabs.List grow>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.NOTES} ml="xs">
                    Notes
                </Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.REPLIES}>Replies</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWERS}>Followers</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWING} mr="xs">
                    Following
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="notes">
                <Notes
                    notes={notes}
                    usersMetadata={usersMetadata}
                    loading={loadingForNotes}
                    interactionStats={interactionStatsForNotes}
                    loadNotes={loadNotes}
                />
            </Tabs.Panel>

            <Tabs.Panel value="replies">
                <Notes
                    notes={replies}
                    usersMetadata={usersMetadata}
                    loading={loadingForReplies}
                    interactionStats={interactionStatsForReplies}
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
