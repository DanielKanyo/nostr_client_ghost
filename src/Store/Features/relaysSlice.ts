import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initRelays = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net", "wss://nostr.wine"];

export const relaysSlice = createSlice({
    name: "relays",
    initialState: initRelays,
    reducers: {
        setRelays: (_state, action: PayloadAction<string[]>) => {
            return action.payload;
        },
        updateRelays: (state, action: PayloadAction<string>) => {
            state.push(action.payload);
        },
        removeRelay: (state, action: PayloadAction<string>) => {
            return state.filter((relay) => relay !== action.payload);
        },
        resetRelays: () => {
            return initRelays;
        },
    },
});

export const { setRelays, updateRelays, removeRelay, resetRelays } = relaysSlice.actions;
export default relaysSlice.reducer;
