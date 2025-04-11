import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { UserMetadata } from "../../Types/userMetadata";

type UserState = {
    data: UserMetadata | null;
    loading: boolean;
    authenticated: boolean;
    privateKey: string;
    publicKey: string;
};

const initUser: UserState = {
    data: null,
    loading: true,
    authenticated: false,
    privateKey: "",
    publicKey: "",
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
        updateKeys: (state, action: PayloadAction<{ privateKey: string; publicKey: string }>) => {
            state.privateKey = action.payload.privateKey;
            state.publicKey = action.payload.publicKey;
        },
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.authenticated = action.payload;
        },
    },
});

export const { updateUser, resetUser, updateLoading, updateAuthenticated, updateKeys } = userSlice.actions;
export default userSlice.reducer;
