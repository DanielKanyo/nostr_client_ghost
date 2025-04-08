import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { UserMetadata } from "../../Types/UserMetadata";

type UserState = {
    data: UserMetadata | null;
    loading: boolean;
    authenticated: boolean;
};

const initUser: UserState = {
    data: null,
    loading: true,
    authenticated: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState: initUser,
    reducers: {
        updateUser: (state, action: PayloadAction<UserMetadata>) => {
            state.data = action.payload;
            state.loading = false;
        },
        resetUser: (state) => {
            state.data = null;
            state.authenticated = false;
        },
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.authenticated = action.payload;
        },
    },
});

export const { updateUser, resetUser, updateLoading, updateAuthenticated } = userSlice.actions;
export default userSlice.reducer;
