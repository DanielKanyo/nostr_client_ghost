import { NostrEvent } from "nostr-tools";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserMetadata } from "../../Types/userMetadata";

interface NoteDataState {
    notes: NostrEvent[];
    usersMetadata: UserMetadata[];
    until: number | undefined;
    loading: boolean;
}

const initialState: NoteDataState = {
    notes: [],
    usersMetadata: [],
    until: undefined,
    loading: false,
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
        resetNotes: (state) => {
            state.notes = [];
            state.until = undefined;
        },
    },
});

export const { setNoteData, appendNoteData, setUsersMetadata, setUntil, setLoading, resetNotes } = noteDataSlice.actions;
export default noteDataSlice.reducer;
