import { NostrEvent } from "nostr-tools";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { NoteFilterOptions } from "../../Shared/utils";
import { InteractionCounts } from "../../Types/interactionCounts";
import { UserMetadata } from "../../Types/userMetadata";

interface NoteDataState {
    notes: NostrEvent[];
    usersMetadata: UserMetadata[];
    until: number | undefined;
    loading: boolean;
    filter: NoteFilterOptions;
    interactionCounts: { [noteId: string]: InteractionCounts }; // Per-note counts
}

const initialState: NoteDataState = {
    notes: [],
    usersMetadata: [],
    until: undefined,
    loading: false,
    filter: NoteFilterOptions.Notes,
    interactionCounts: {},
};

const noteDataSlice = createSlice({
    name: "noteData",
    initialState,
    reducers: {
        setNoteData: (state, action: PayloadAction<NostrEvent[]>) => {
            state.notes = action.payload;
        },
        appendNoteData: (state, action: PayloadAction<NostrEvent[]>) => {
            state.notes = [...state.notes, ...action.payload];
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
        setInteractionCounts: (state, action: PayloadAction<{ [noteId: string]: InteractionCounts }>) => {
            state.interactionCounts = action.payload;
        },
        appendInteractionCounts: (state, action: PayloadAction<{ [noteId: string]: InteractionCounts }>) => {
            state.interactionCounts = { ...state.interactionCounts, ...action.payload };
        },
        resetNotes: (state) => {
            state.notes = [];
            state.until = undefined;
        },
    },
});

export const {
    setNoteData,
    appendNoteData,
    setUsersMetadata,
    setUntil,
    setLoading,
    setFilter,
    setInteractionCounts,
    appendInteractionCounts,
    resetNotes,
} = noteDataSlice.actions;
export default noteDataSlice.reducer;
