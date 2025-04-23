import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ScrollPositionState = {
    [key: string]: number;
};

type UpdateScrollPayload = {
    key: string;
    value: number;
};

const initState: ScrollPositionState = {};

export const scrollPositionSlice = createSlice({
    name: "scrollPosition",
    initialState: initState,
    reducers: {
        updateScrollPosition: (state, action: PayloadAction<UpdateScrollPayload>) => {
            state[action.payload.key] = action.payload.value;
        },
    },
});

export const { updateScrollPosition } = scrollPositionSlice.actions;
export default scrollPositionSlice.reducer;
