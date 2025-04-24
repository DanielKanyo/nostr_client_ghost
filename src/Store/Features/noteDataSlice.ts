import { NostrEvent } from "nostr-tools";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { NoteFilterOptions } from "../../Shared/utils";
import { InteractionStats } from "../../Types/interactionStats";
import { UserMetadata } from "../../Types/userMetadata";

const NOTE_LIST_MAX_LENGTH = 50;

interface NoteDataState {
    notes: NostrEvent[];
    replies: NostrEvent[];
    usersMetadata: UserMetadata[];
    until: number | undefined;
    loading: boolean;
    filter: NoteFilterOptions;
    interactionStats: { [noteId: string]: InteractionStats };
    trimmed: boolean;
}

const initialState: NoteDataState = {
    notes: [],
    replies: [],
    usersMetadata: [],
    until: undefined,
    loading: false,
    filter: NoteFilterOptions.All,
    interactionStats: {},
    trimmed: false,
};

const noteDataSlice = createSlice({
    name: "noteData",
    initialState,
    reducers: {
        setNoteData: (state, action: PayloadAction<NostrEvent[]>) => {
            state.notes = action.payload;
        },
        setReplies: (state, action: PayloadAction<NostrEvent[]>) => {
            state.replies = action.payload;
        },
        appendNoteData: (state, action: PayloadAction<NostrEvent[]>) => {
            const oldNotes = state.notes;
            const newNotes = action.payload;

            if (oldNotes.length + newNotes.length > NOTE_LIST_MAX_LENGTH) {
                oldNotes.splice(0, newNotes.length);

                state.trimmed = true;
            } else {
                state.trimmed = false;
            }

            state.notes = [...oldNotes, ...newNotes];
        },
        appendReplyData: (state, action: PayloadAction<NostrEvent[]>) => {
            const oldReplies = state.replies;
            const newReplies = action.payload;

            if (oldReplies.length + newReplies.length > NOTE_LIST_MAX_LENGTH) {
                oldReplies.splice(0, newReplies.length);
            }

            state.notes = [...oldReplies, ...newReplies];
        },
        setUsersMetadata: (state, action: PayloadAction<UserMetadata[]>) => {
            state.usersMetadata = action.payload;
        },
        setUntil: (state, action: PayloadAction<number | undefined>) => {
            state.until = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setFilter: (state, action: PayloadAction<NoteFilterOptions>) => {
            state.filter = action.payload;
        },
        setInteractionStats: (state, action: PayloadAction<{ [noteId: string]: InteractionStats }>) => {
            state.interactionStats = action.payload;
        },
        appendInteractionStats: (state, action: PayloadAction<{ [noteId: string]: InteractionStats }>) => {
            state.interactionStats = { ...state.interactionStats, ...action.payload };
        },
        resetNotes: (state) => {
            state.notes = [];
            state.replies = [];
            state.usersMetadata = [];
            state.interactionStats = {};
            state.until = undefined;
            state.trimmed = false;
        },
    },
});

export const {
    setNoteData,
    setReplies,
    appendNoteData,
    appendReplyData,
    setUsersMetadata,
    setUntil,
    setLoading,
    setFilter,
    setInteractionStats,
    appendInteractionStats,
    resetNotes,
} = noteDataSlice.actions;
export default noteDataSlice.reducer;
