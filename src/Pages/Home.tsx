import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";

import isEqual from "lodash/isEqual";
import { SimplePool } from "nostr-tools";

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
import { fetchInteractionCounts, fetchNotes } from "../Services/noteService";
import { closePool, fetchMultipleUserMetadata } from "../Services/userService";
import {
    DEFAULT_MAIN_CONTAINER_WIDTH,
    DEFAULT_NUM_OF_DISPLAYED_NOTES,
    DEFAULT_SIDE_CONTAINER_WIDTH,
    NoteFilterOptions,
} from "../Shared/utils";
import {
    appendInteractionCounts,
    appendNoteData,
    resetNotes,
    setFilter,
    setInteractionCounts,
    setLoading,
    setNoteData,
    setUntil,
    setUsersMetadata,
} from "../Store/Features/noteDataSlice";
import { useAppSelector } from "../Store/hook";

export default function Home() {
    const { notes, usersMetadata, until, filter, interactionCounts, loading } = useAppSelector((state) => state.noteData);
    const user = useAppSelector((state) => state.user);
    const relays = useAppSelector((state) => state.relays);
    const previousFollowing = useRef(user.following);
    const dispatch = useDispatch();

    const loadNotes = useCallback(
        async (reset: boolean = false) => {
            if (loading) return;

            dispatch(setLoading(true));
            const pool = new SimplePool();

            try {
                const newNotes = await fetchNotes(
                    pool,
                    [...user.following, user.publicKey],
                    DEFAULT_NUM_OF_DISPLAYED_NOTES,
                    filter,
                    reset ? undefined : until
                );

                if (newNotes.length > 0) {
                    const metadataMap = await fetchMultipleUserMetadata(pool, user.following);
                    const noteIds = newNotes.map((note) => note.id);
                    const newInteractionCounts = await fetchInteractionCounts(pool, noteIds, relays);

                    const combinedMetadata = new Map(metadataMap);
                    combinedMetadata.set(user.publicKey, user.profile!);

                    dispatch(setUsersMetadata(Array.from(combinedMetadata.values())));
                    dispatch(reset ? setNoteData(newNotes) : appendNoteData(newNotes));
                    dispatch(reset ? setInteractionCounts(newInteractionCounts) : appendInteractionCounts(newInteractionCounts));

                    dispatch(setUntil(newNotes[newNotes.length - 1].created_at - 1));
                }
            } catch (error) {
                console.error("Error loading notes:", error);
            } finally {
                closePool(pool);
                dispatch(setLoading(false));
            }
        },
        [user.following, user.publicKey, filter, until, relays, user.profile, dispatch, loading]
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
                            notes={notes}
                            usersMetadata={usersMetadata}
                            loading={loading}
                            loadNotes={loadNotes}
                            interactionCounts={interactionCounts}
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
