import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const primaryColorSlice = createSlice({
    name: "user",
    initialState: "violet",
    reducers: {
        updatePrimaryColor: (_state, action: PayloadAction<string>) => {
            return action.payload;
        },
    },
});

export const { updatePrimaryColor } = primaryColorSlice.actions;
export default primaryColorSlice.reducer;
