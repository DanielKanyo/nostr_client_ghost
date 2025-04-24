import { NostrEvent } from "nostr-tools";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InteractionStats } from "../../Types/interactionStats";
import { UserMetadata } from "../../Types/userMetadata";

type SelectedUserStateBasic = {
    pubkey: string;
    profile: UserMetadata | null;
    followingPubkeys: string[];
    followersPubkeys: string[];
};

type SelectedUserStateNoteData = {
    notes: NostrEvent[];
    interactionStatsForNotes: { [noteId: string]: InteractionStats };
    untilForNotes: number | undefined;
    initNotesLoaded?: boolean;
};

type SelectedUserStateReplyData = {
    replies: NostrEvent[];
    replyDetails: NostrEvent[];
    interactionStatsForReplies: { [noteId: string]: InteractionStats };
    untilForReplies: number | undefined;
    initRepliesLoaded?: boolean;
    replyDetailsUsersMetadata: UserMetadata[];
};

type SelectedUserStateFollowingData = {
    followingProfiles: UserMetadata[];
    followingFetchCount: number;
    initFollowingProfilesLoaded?: boolean;
};

type SelectedUserStateFollowersData = {
    followersProfiles: UserMetadata[];
    followersFetchCount: number;
    initFollowersProfilesLoaded?: boolean;
};

interface SelectedUserState
    extends SelectedUserStateBasic,
        SelectedUserStateNoteData,
        SelectedUserStateReplyData,
        SelectedUserStateFollowingData,
        SelectedUserStateFollowersData {}

const initSelectedUser: SelectedUserState = {
    pubkey: "",
    profile: null,
    followingPubkeys: [],
    followersPubkeys: [],

    notes: [],
    interactionStatsForNotes: {},
    untilForNotes: undefined,
    initNotesLoaded: false,

    replies: [],
    replyDetails: [],
    interactionStatsForReplies: {},
    untilForReplies: undefined,
    initRepliesLoaded: false,
    replyDetailsUsersMetadata: [],

    followingProfiles: [],
    followingFetchCount: 0,
    initFollowingProfilesLoaded: false,

    followersProfiles: [],
    followersFetchCount: 0,
    initFollowersProfilesLoaded: false,
};

export const selectedUserSlice = createSlice({
    name: "selectedUser",
    initialState: initSelectedUser,
    reducers: {
        updateSelectedUserBasic: (state, action: PayloadAction<SelectedUserStateBasic>) => {
            state.pubkey = action.payload.pubkey;
            state.profile = action.payload.profile;
            state.followersPubkeys = action.payload.followersPubkeys;
            state.followingPubkeys = action.payload.followingPubkeys;
        },
        updateSelectedUserNoteData: (state, action: PayloadAction<SelectedUserStateNoteData>) => {
            state.notes = action.payload.notes;
            state.interactionStatsForNotes = action.payload.interactionStatsForNotes;
            state.untilForNotes = action.payload.untilForNotes;
            state.initNotesLoaded = action.payload.initNotesLoaded;
        },
        appendSelectedUserNoteData: (state, action: PayloadAction<SelectedUserStateNoteData>) => {
            state.notes = [...state.notes, ...action.payload.notes];
            state.interactionStatsForNotes = { ...state.interactionStatsForNotes, ...action.payload.interactionStatsForNotes };
            state.untilForNotes = action.payload.untilForNotes;
        },
        updateInitNotesLoaded: (state, action: PayloadAction<boolean>) => {
            state.initNotesLoaded = action.payload;
        },
        updateSelectedUserReplyData: (state, action: PayloadAction<SelectedUserStateReplyData>) => {
            state.replies = action.payload.replies;
            state.replyDetails = action.payload.replyDetails;
            state.interactionStatsForReplies = action.payload.interactionStatsForReplies;
            state.untilForReplies = action.payload.untilForReplies;
            state.replyDetailsUsersMetadata = action.payload.replyDetailsUsersMetadata;
        },
        appendSelectedUserReplyData: (state, action: PayloadAction<SelectedUserStateReplyData>) => {
            state.replies = [...state.replies, ...action.payload.replies];
            state.replyDetails = [...state.replies, ...action.payload.replyDetails];
            state.interactionStatsForReplies = { ...state.interactionStatsForReplies, ...action.payload.interactionStatsForReplies };
            state.untilForReplies = action.payload.untilForReplies;
            state.initRepliesLoaded = action.payload.initRepliesLoaded;
            state.replyDetailsUsersMetadata = [...state.replyDetailsUsersMetadata, ...action.payload.replyDetailsUsersMetadata];
        },
        updateInitRepliesLoaded: (state, action: PayloadAction<boolean>) => {
            state.initRepliesLoaded = action.payload;
        },
        updateSelectedUserFollowingData: (state, action: PayloadAction<SelectedUserStateFollowingData>) => {
            state.followingProfiles = action.payload.followingProfiles;
            state.followingFetchCount = action.payload.followingFetchCount;
            state.initFollowingProfilesLoaded = action.payload.initFollowingProfilesLoaded;
        },
        appendSelectedUserFollowingData: (state, action: PayloadAction<SelectedUserStateFollowingData>) => {
            state.followingProfiles = [...state.followingProfiles, ...action.payload.followingProfiles];
            state.followingFetchCount = action.payload.followingFetchCount;
            state.initFollowingProfilesLoaded = action.payload.initFollowingProfilesLoaded;
        },
        updateSelectedUserFollowersData: (state, action: PayloadAction<SelectedUserStateFollowersData>) => {
            state.followersProfiles = action.payload.followersProfiles;
            state.followersFetchCount = action.payload.followersFetchCount;
            state.initFollowersProfilesLoaded = action.payload.initFollowersProfilesLoaded;
        },
        appendSelectedUserFollowersData: (state, action: PayloadAction<SelectedUserStateFollowersData>) => {
            state.followersProfiles = [...state.followersProfiles, ...action.payload.followersProfiles];
            state.followersFetchCount = action.payload.followersFetchCount;
            state.initFollowersProfilesLoaded = action.payload.initFollowersProfilesLoaded;
        },
        addSelectedUserFollowingProfile: (state, action: PayloadAction<UserMetadata>) => {
            state.followingProfiles.push(action.payload);
        },
        removeSelectedUserFollowingProfile: (state, action: PayloadAction<string>) => {
            state.followingProfiles = state.followingProfiles.filter((p) => p.pubkey !== action.payload);
        },
        resetSelectedUser: () => {
            return initSelectedUser;
        },
    },
});

export const {
    updateSelectedUserBasic,

    updateSelectedUserNoteData,
    appendSelectedUserNoteData,
    updateSelectedUserReplyData,
    appendSelectedUserReplyData,
    updateInitNotesLoaded,
    updateInitRepliesLoaded,

    updateSelectedUserFollowingData,
    appendSelectedUserFollowingData,

    updateSelectedUserFollowersData,
    appendSelectedUserFollowersData,

    addSelectedUserFollowingProfile,
    removeSelectedUserFollowingProfile,
    resetSelectedUser,
} = selectedUserSlice.actions;
export default selectedUserSlice.reducer;
