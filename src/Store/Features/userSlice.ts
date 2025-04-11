import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { UserMetadata } from "../../Types/userMetadata";

type UserState = {
    profile: UserMetadata | null;
    authenticated: boolean;
    privateKey: string;
    publicKey: string;
    loading: boolean;
};

const initUser: UserState = {
    profile: null,
    authenticated: false,
    privateKey: "",
    publicKey: "",
    loading: true,
};

export const userSlice = createSlice({
    name: "user",
    initialState: initUser,
    reducers: {
        updateUserProfile: (state, action: PayloadAction<UserMetadata>) => {
            state.profile = action.payload;
            state.loading = false;
        },
        resetUser: (state) => {
            state.profile = null;
            state.authenticated = false;
        },
        updateUserKeys: (state, action: PayloadAction<{ privateKey: string; publicKey: string }>) => {
            state.privateKey = action.payload.privateKey;
            state.publicKey = action.payload.publicKey;
        },
        updateUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateUserAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.authenticated = action.payload;
        },
    },
});

export const { updateUserProfile, resetUser, updateUserLoading, updateUserAuthenticated, updateUserKeys } = userSlice.actions;
export default userSlice.reducer;
