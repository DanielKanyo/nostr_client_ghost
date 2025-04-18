import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import isEqual from "lodash/isEqual";
import { SimplePool } from "nostr-tools";

import Content from "../Layouts/Content";
import CreateNote from "../Layouts/CreateNote/CreateNote";
import MainContainer from "../Layouts/MainContainer";
import Notes from "../Layouts/Notes";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";
import { fetchNotes } from "../Services/noteService";
import { fetchMultipleUserMetadata, closePool } from "../Services/userService";
import { DEFAULT_NUM_OF_DISPLAYED_NOTES, NoteFilterOptions } from "../Shared/utils";
import { setLoading, setUsersMetadata, setNoteData, appendNoteData, setUntil, resetNotes } from "../Store/Features/noteDataSlice";
import { useAppSelector } from "../Store/hook";

export default function Home() {
    const user = useAppSelector((state) => state.user);
    const { notes, usersMetadata, until, loading } = useAppSelector((state) => state.noteData);
    const previousFollowing = useRef(user.following);
    const limit = DEFAULT_NUM_OF_DISPLAYED_NOTES;
    const dispatch = useDispatch();

    const loadNotes = async (reset: boolean = false) => {
        dispatch(setLoading(true));

        const pool = new SimplePool();

        try {
            // TODO: Include logged in user public key
            const newNotes = await fetchNotes(pool, user.following, limit, NoteFilterOptions.Notes, reset ? undefined : until);

            if (newNotes.length > 0) {
                const metadataMap = await fetchMultipleUserMetadata(pool, user.following);

                dispatch(setUsersMetadata(Array.from(metadataMap.values())));
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
    }, [user.following, NoteFilterOptions.Notes]);

    useEffect(() => {
        if (!isEqual(user.following, previousFollowing.current)) {
            dispatch(resetNotes());
            previousFollowing.current = user.following;
        }
    }, [user.following, NoteFilterOptions.Notes, dispatch]);

    return (
        <Content>
            <MainContainer width={680}>
                <ScrollContainer>
                    <CreateNote />
                    <Notes notes={notes} usersMetadata={usersMetadata} loading={loading} loadNotes={loadNotes} />
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
