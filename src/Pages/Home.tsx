import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import isEqual from "lodash/isEqual";
import { SimplePool } from "nostr-tools";

import { Divider, Flex } from "@mantine/core";

import Filter from "../Components/Note/Filter/Filter";
import RelayStatusIndicator from "../Components/RelayStatusIndicator";
import Search from "../Components/Search/Search";
import Content from "../Layouts/Content";
import CreateNote from "../Layouts/CreateNote/CreateNote";
import MainContainer from "../Layouts/MainContainer";
import Notes from "../Layouts/Notes";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";
import { fetchNotes } from "../Services/noteService";
import { closePool, fetchMultipleUserMetadata } from "../Services/userService";
import {
    DEFAULT_MAIN_CONTAINER_WIDTH,
    DEFAULT_NUM_OF_DISPLAYED_NOTES,
    DEFAULT_SIDE_CONTAINER_WIDTH,
    NoteFilterOptions,
} from "../Shared/utils";
import {
    appendNoteData,
    resetNotes,
    setFilter,
    setLoading,
    setNoteData,
    setUntil,
    setUsersMetadata,
} from "../Store/Features/noteDataSlice";
import { useAppSelector } from "../Store/hook";

export default function Home() {
    const { notes, usersMetadata, until, filter, loading } = useAppSelector((state) => state.noteData);
    const user = useAppSelector((state) => state.user);
    const previousFollowing = useRef(user.following);
    const dispatch = useDispatch();

    const loadNotes = async (reset: boolean = false) => {
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

                dispatch(setUsersMetadata([...Array.from(metadataMap.values()), user.profile!]));
                dispatch(reset ? setNoteData(newNotes) : appendNoteData(newNotes));

                dispatch(setUntil(newNotes[newNotes.length - 1].created_at - 1));
            }
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            closePool(pool);
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        const hasData = notes.length > 0 && usersMetadata.length > 0;

        if (user.following.length > 0 && !hasData) {
            loadNotes(true);
        }
    }, [user.following, filter]);

    useEffect(() => {
        if (!isEqual(user.following, previousFollowing.current)) {
            dispatch(resetNotes());
            previousFollowing.current = user.following;
        }
    }, [user.following, dispatch]);

    const handleFilterChange = (option: NoteFilterOptions) => {
        dispatch(resetNotes());
        dispatch(setFilter(option));
    };

    const reloadNotes = () => {
        dispatch(resetNotes());
        loadNotes(true);
    };

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <ScrollContainer>
                    <CreateNote reloadNotes={reloadNotes} />
                    <Filter filter={filter} handleFilterChange={handleFilterChange} />
                    <Divider />
                    <Notes notes={notes} usersMetadata={usersMetadata} loading={loading} loadNotes={loadNotes} />
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
