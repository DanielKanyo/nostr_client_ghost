import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const scrollPositionSlice = createSlice({
    name: "scrollPosition",
    initialState: 0,
    reducers: {
        updateScrollPosition: (_state, action: PayloadAction<number>) => {
            return action.payload;
        },
    },
});

export const { updateScrollPosition } = scrollPositionSlice.actions;
export default scrollPositionSlice.reducer;
