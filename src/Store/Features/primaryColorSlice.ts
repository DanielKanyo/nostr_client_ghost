import { MantineColor } from "@mantine/core";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PrimaryColorState = {
    color: MantineColor;
    borderColor: MantineColor;
};

const initValue = {
    color: "",
    borderColor: "",
};

export const primaryColorSlice = createSlice({
    name: "user",
    initialState: initValue,
    reducers: {
        updatePrimaryColor: (_state, action: PayloadAction<PrimaryColorState>) => {
            return action.payload;
        },
    },
});

export const { updatePrimaryColor } = primaryColorSlice.actions;
export default primaryColorSlice.reducer;
