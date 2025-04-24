import { NostrEvent } from "nostr-tools";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { NoteFilterOptions } from "../../Shared/utils";
import { InteractionStats } from "../../Types/interactionStats";
import { UserMetadata } from "../../Types/userMetadata";

interface NoteDataState {
    notes: NostrEvent[];
    replyDetails: NostrEvent[];
    usersMetadata: UserMetadata[];
    replyDetailsUsersMetadata: UserMetadata[];
    until: number | undefined;
    loading: boolean;
    filter: NoteFilterOptions;
    interactionStats: { [noteId: string]: InteractionStats };
}

const initialState: NoteDataState = {
    notes: [],
    replyDetails: [],
    usersMetadata: [],
    replyDetailsUsersMetadata: [],
    until: undefined,
    loading: false,
    filter: NoteFilterOptions.All,
    interactionStats: {},
};

const noteDataSlice = createSlice({
    name: "noteData",
    initialState,
    reducers: {
        setNoteData: (state, action: PayloadAction<NostrEvent[]>) => {
            state.notes = action.payload;
        },
        setReplyDetails: (state, action: PayloadAction<NostrEvent[]>) => {
            state.replyDetails = action.payload;
        },
        appendNoteData: (state, action: PayloadAction<NostrEvent[]>) => {
            state.notes = [...state.notes, ...action.payload];
        },
        appendReplyDetails: (state, action: PayloadAction<NostrEvent[]>) => {
            state.replyDetails = [...state.replyDetails, ...action.payload];
        },
        setUsersMetadata: (state, action: PayloadAction<UserMetadata[]>) => {
            state.usersMetadata = action.payload;
        },
        setReplyDetailsUsersMetadata: (state, action: PayloadAction<UserMetadata[]>) => {
            state.replyDetailsUsersMetadata = action.payload;
        },
        appendReplyDetailsUsersMetadata: (state, action: PayloadAction<UserMetadata[]>) => {
            state.replyDetailsUsersMetadata = [state.replyDetailsUsersMetadata, ...action.payload];
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
            state.replyDetails = [];
            state.usersMetadata = [];
            state.replyDetailsUsersMetadata = [];
            state.interactionStats = {};
            state.until = undefined;
        },
    },
});

export const {
    setNoteData,
    setReplyDetails,
    appendNoteData,
    appendReplyDetails,
    setReplyDetailsUsersMetadata,
    appendReplyDetailsUsersMetadata,
    setUsersMetadata,
    setUntil,
    setLoading,
    setFilter,
    setInteractionStats,
    appendInteractionStats,
    resetNotes,
} = noteDataSlice.actions;
export default noteDataSlice.reducer;
