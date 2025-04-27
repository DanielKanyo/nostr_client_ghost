import { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

import isEqual from "lodash/isEqual";
import { NostrEvent, SimplePool } from "nostr-tools";

import { Divider, Flex } from "@mantine/core";
import { IconNoteOff } from "@tabler/icons-react";

import Empty from "../Components/Empty";
import Filter from "../Components/Note/Filter/Filter";
import RelayStatusIndicator from "../Components/RelayStatusIndicator";
import Search from "../Components/Search/Search";
import Content from "../Layouts/Content";
import CreateNote from "../Layouts/CreateNote/CreateNote";
import MainContainer from "../Layouts/MainContainer";
import Notes from "../Layouts/Notes";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";
import { collectReplyEventsAndPubkeys } from "../Services/eventSerive";
import { fetchInteractionStats, fetchNotes } from "../Services/noteService";
import { closePool, fetchMultipleUserMetadata } from "../Services/userService";
import {
    DEFAULT_MAIN_CONTAINER_WIDTH,
    DEFAULT_NUM_OF_DISPLAYED_ITEMS,
    DEFAULT_SIDE_CONTAINER_WIDTH,
    DISPLAY_NOTE_LIMIT,
    NoteFilterOptions,
} from "../Shared/utils";
import {
    appendInteractionStats,
    appendNoteData,
    appendReplyDetails,
    appendReplyDetailsUsersMetadata,
    resetNotes,
    setFilter,
    setInteractionStats,
    setLoading,
    setNoteData,
    setReplyDetails,
    setReplyDetailsUsersMetadata,
    setUntil,
    setUsersMetadata,
} from "../Store/Features/noteDataSlice";
import { useAppSelector } from "../Store/hook";

export default function Home() {
    const { notes, replyDetails, replyDetailsUsersMetadata, usersMetadata, until, filter, interactionStats, loading } = useAppSelector(
        (state) => state.noteData
    );
    const user = useAppSelector((state) => state.user);
    const relays = useAppSelector((state) => state.relays);
    const previousFollowing = useRef(user.following);
    const dispatch = useDispatch();

    const loadAndStoreNotes = useCallback(
        async (pool: SimplePool, newNotes: NostrEvent[], reset: boolean): Promise<void> => {
            const metadataMap = await fetchMultipleUserMetadata(pool, user.following);
            const noteIds = newNotes.map((note) => note.id);
            const newInteractionStats = await fetchInteractionStats(pool, noteIds, relays);

            const combinedMetadata = new Map(metadataMap);
            combinedMetadata.set(user.publicKey, user.profile!);

            dispatch(setUsersMetadata(Array.from(combinedMetadata.values())));
            dispatch(reset ? setNoteData(newNotes) : appendNoteData(newNotes));
            dispatch(reset ? setInteractionStats(newInteractionStats) : appendInteractionStats(newInteractionStats));

            dispatch(setUntil(newNotes[newNotes.length - 1].created_at - 1));
        },
        [user.following, user.publicKey, user.profile, relays]
    );

    const loadAndStoreReplyDetails = useCallback(async (pool: SimplePool, notes: NostrEvent[], reset: boolean): Promise<void> => {
        const replyData = await collectReplyEventsAndPubkeys(pool, notes);
        const usersMetadataMap = await fetchMultipleUserMetadata(pool, replyData.pubkeys);
        const usersMetadata = Array.from(usersMetadataMap.values());

        dispatch(reset ? setReplyDetails(replyData.replyEvents) : appendReplyDetails(replyData.replyEvents));
        dispatch(reset ? setReplyDetailsUsersMetadata(usersMetadata) : appendReplyDetailsUsersMetadata(usersMetadata));
    }, []);

    const loadNotes = useCallback(
        async (reset: boolean = false) => {
            if (loading) return;

            dispatch(setLoading(true));
            const pool = new SimplePool();

            try {
                const newNotes = await fetchNotes(
                    pool,
                    [...user.following, user.publicKey],
                    DEFAULT_NUM_OF_DISPLAYED_ITEMS,
                    filter,
                    reset ? undefined : until
                );

                if (newNotes.length > 0) {
                    await loadAndStoreReplyDetails(pool, newNotes, reset);
                    await loadAndStoreNotes(pool, newNotes, reset);
                }
            } catch (error) {
                // TODO: Error handling
                console.error("Error loading notes:", error);
            } finally {
                closePool(pool);
                dispatch(setLoading(false));
            }
        },
        [user.following, user.publicKey, filter, until, relays, user.profile, loading, dispatch]
    );

    useEffect(() => {
        const hasData = notes.length > 0 && usersMetadata.length > 0;

        if (user.following.length > 0 && !hasData && relays.length) {
            loadNotes(true);
        }
    }, [user.following, filter, relays, notes.length, usersMetadata.length, loadNotes]);

    useEffect(() => {
        if (!isEqual(user.following, previousFollowing.current)) {
            dispatch(resetNotes());
            previousFollowing.current = user.following;
        }
    }, [user.following, dispatch]);

    const handleFilterChange = useCallback(
        (option: NoteFilterOptions) => {
            dispatch(resetNotes());
            dispatch(setFilter(option));
        },
        [dispatch]
    );

    const reloadNotes = useCallback(() => {
        dispatch(resetNotes());
        loadNotes(true);
    }, [dispatch, loadNotes]);

    const visibleNotes = useMemo(() => notes.slice(-DISPLAY_NOTE_LIMIT), [notes.length]);

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <ScrollContainer>
                    <CreateNote reloadNotes={reloadNotes} />
                    <Filter filter={filter} handleFilterChange={handleFilterChange} />
                    <Divider />
                    {!loading && notes.length === 0 ? (
                        <Empty icon={<IconNoteOff size={30} />} text="No notes to display..." />
                    ) : (
                        <Notes
                            notes={visibleNotes}
                            replyDetails={replyDetails}
                            usersMetadata={[...usersMetadata, ...replyDetailsUsersMetadata]}
                            loading={loading}
                            interactionStats={interactionStats}
                            loadNotes={loadNotes}
                            reloadNotes={reloadNotes}
                        />
                    )}
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>
                <Flex h="100vh" direction="column" justify="space-between">
                    <Search />
                    <RelayStatusIndicator />
                </Flex>
            </SideContainer>
        </Content>
    );
}
