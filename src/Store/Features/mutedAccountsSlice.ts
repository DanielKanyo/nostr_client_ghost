import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const mutedAccountsSlice = createSlice({
    name: "mutedAccounts",
    initialState: [] as string[],
    reducers: {
        updateMutedAccounts: (_state, action: PayloadAction<string[]>) => {
            return action.payload;
        },
    },
});

export const { updateMutedAccounts } = mutedAccountsSlice.actions;
export default mutedAccountsSlice.reducer;
