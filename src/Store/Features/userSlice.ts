import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { UserMetadata } from "../../Types/userMetadata";

export type UserState = {
    profile: UserMetadata | null;
    authenticated: boolean;
    privateKey: string;
    publicKey: string;
    loading: boolean;
    followers: string[];
    following: string[];
};

const initUser: UserState = {
    profile: null,
    authenticated: false,
    privateKey: "",
    publicKey: "",
    loading: false,
    followers: [],
    following: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState: initUser,
    reducers: {
        updateUser: (_state, action: PayloadAction<UserState>) => {
            return action.payload;
        },
        updateUserProfile: (state, action: PayloadAction<UserMetadata | null>) => {
            state.profile = action.payload;
        },
        resetUser: () => {
            return initUser;
        },
        updateUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateUserFollowing: (state, action: PayloadAction<string[]>) => {
            state.following = action.payload;
        },
    },
});

export const { updateUser, updateUserProfile, resetUser, updateUserLoading, updateUserFollowing } = userSlice.actions;
export default userSlice.reducer;
