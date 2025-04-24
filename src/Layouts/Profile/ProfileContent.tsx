import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { SimplePool } from "nostr-tools";

import { Tabs } from "@mantine/core";

import { fetchInteractionStats, fetchNotes } from "../../Services/noteService";
import { closePool, fetchMultipleUserMetadata } from "../../Services/userService";
import { DEFAULT_NUM_OF_DISPLAYED_ITEMS, NoteFilterOptions, PROFILE_CONTENT_TABS } from "../../Shared/utils";
import {
    appendSelectedUserFollowersData,
    appendSelectedUserFollowingData,
    appendSelectedUserNoteData,
    appendSelectedUserReplyData,
    updateInitNotesLoaded,
    updateInitRepliesLoaded,
    updateSelectedUserFollowersData,
    updateSelectedUserFollowingData,
    updateSelectedUserNoteData,
    updateSelectedUserReplyData,
} from "../../Store/Features/selectedUserSlice";
import { useAppSelector } from "../../Store/hook";
import Notes from "../Notes";
import UserList from "../UserList";

interface ProfileContentProps {
    activeUserPubkey: string;
    activeTab: string | null;
    handleActiveTabChange: (value: PROFILE_CONTENT_TABS) => void;
    followers: string[];
    following: string[];
}

export default function ProfileContent({ activeUserPubkey, activeTab, followers, following, handleActiveTabChange }: ProfileContentProps) {
    const { color } = useAppSelector((state) => state.primaryColor);
    const su = useAppSelector((state) => state.selectedUser);
    const relays = useAppSelector((state) => state.relays);
    const dispatch = useDispatch();

    const [loadingForNotes, setLoadingForNotes] = useState(false);
    const [loadingForReplies, setLoadingForReplies] = useState(false);
    const [loadingForFollowing, setLoadingForFollowing] = useState(false);
    const [loadingForFollowers, setLoadingForFollowers] = useState(false);

    const limit = DEFAULT_NUM_OF_DISPLAYED_ITEMS;

    const loadNotes = useCallback(
        async (reset = false) => {
            setLoadingForNotes(true);

            const pool = new SimplePool();

            try {
                const until = reset ? undefined : su.untilForNotes;
                const notes = await fetchNotes(pool, [activeUserPubkey], limit, NoteFilterOptions.Notes, until);

                if (notes.length > 0) {
                    const noteIds = notes.map((note) => note.id);
                    const newInteractionStats = await fetchInteractionStats(pool, noteIds, relays);
                    const newUntil = notes[notes.length - 1].created_at - 1;

                    if (reset) {
                        dispatch(
                            updateSelectedUserNoteData({
                                notes,
                                interactionStatsForNotes: newInteractionStats,
                                untilForNotes: newUntil,
                                initNotesLoaded: true,
                            })
                        );
                    } else {
                        dispatch(
                            appendSelectedUserNoteData({
                                notes: notes,
                                interactionStatsForNotes: newInteractionStats,
                                untilForNotes: newUntil,
                            })
                        );
                    }
                } else {
                    dispatch(updateInitNotesLoaded(true));
                }
            } catch (error) {
                console.error("Error loading notes:", error);
            } finally {
                closePool(pool);
                setLoadingForNotes(false);
            }
        },
        [activeUserPubkey, su.untilForNotes]
    );

    const loadReplies = useCallback(
        async (reset = false) => {
            setLoadingForReplies(true);

            const pool = new SimplePool();

            try {
                const until = reset ? undefined : su.untilForReplies;
                const replies = await fetchNotes(pool, [activeUserPubkey], limit, NoteFilterOptions.Replies, until);

                if (replies.length > 0) {
                    const noteIds = replies.map((note) => note.id);
                    const newInteractionStats = await fetchInteractionStats(pool, noteIds, relays);
                    const newUntil = replies[replies.length - 1].created_at - 1;

                    if (reset) {
                        dispatch(
                            updateSelectedUserReplyData({
                                replies,
                                interactionStatsForReplies: newInteractionStats,
                                untilForReplies: newUntil,
                                initRepliesLoaded: true,
                            })
                        );
                    } else {
                        dispatch(
                            appendSelectedUserReplyData({
                                replies,
                                interactionStatsForReplies: newInteractionStats,
                                untilForReplies: newUntil,
                            })
                        );
                    }
                } else {
                    dispatch(updateInitRepliesLoaded(true));
                }
            } catch (error) {
                console.error("Error loading replies:", error);
            } finally {
                closePool(pool);
                setLoadingForReplies(false);
            }
        },
        [activeUserPubkey, su.untilForReplies]
    );

    const loadFollowingProfiles = useCallback(
        async (reset = false) => {
            setLoadingForFollowing(true);

            const pool = new SimplePool();

            try {
                const { followingPubkeys, followingFetchCount } = su;
                const batchPubkeys = followingPubkeys.slice(followingFetchCount, followingFetchCount + limit);

                const metadataMap = await fetchMultipleUserMetadata(pool, batchPubkeys);
                const newFollowingFetchCount = followingFetchCount + batchPubkeys.length;

                if (reset) {
                    dispatch(
                        updateSelectedUserFollowingData({
                            followingProfiles: Array.from(metadataMap.values()),
                            followingFetchCount: newFollowingFetchCount,
                            initFollowingProfilesLoaded: true,
                        })
                    );
                } else {
                    dispatch(
                        appendSelectedUserFollowingData({
                            followingProfiles: Array.from(metadataMap.values()),
                            followingFetchCount: newFollowingFetchCount,
                        })
                    );
                }
            } catch (error) {
                console.error("Error loading followings:", error);
            } finally {
                closePool(pool);
                setLoadingForFollowing(false);
            }
        },
        [activeUserPubkey, su.followingPubkeys, su.followingFetchCount]
    );

    const loadFollowersProfiles = useCallback(
        async (reset = false) => {
            setLoadingForFollowers(true);

            const pool = new SimplePool();

            try {
                const { followersPubkeys, followersFetchCount } = su;
                const batchPubkeys = followersPubkeys.slice(followersFetchCount, followersFetchCount + limit);

                const metadataMap = await fetchMultipleUserMetadata(pool, batchPubkeys);
                const newFollowersFetchCount = followersFetchCount + batchPubkeys.length;

                if (reset) {
                    dispatch(
                        updateSelectedUserFollowersData({
                            followersProfiles: Array.from(metadataMap.values()),
                            followersFetchCount: newFollowersFetchCount,
                            initFollowersProfilesLoaded: true,
                        })
                    );
                } else {
                    dispatch(
                        appendSelectedUserFollowersData({
                            followersProfiles: Array.from(metadataMap.values()),
                            followersFetchCount: newFollowersFetchCount,
                        })
                    );
                }
            } catch (error) {
                console.error("Error loading followers:", error);
            } finally {
                closePool(pool);
                setLoadingForFollowers(false);
            }
        },
        [activeUserPubkey, su.followersPubkeys, su.followersFetchCount]
    );

    useEffect(() => {
        const loadNoteData = async () => await loadNotes(true);
        const loadReplieData = async () => await loadReplies(true);
        const loadFollowingData = async () => await loadFollowingProfiles(true);
        const loadFollowersData = async () => await loadFollowersProfiles(true);

        if (!su.initNotesLoaded && activeTab === PROFILE_CONTENT_TABS.NOTES) loadNoteData();
        if (!su.initRepliesLoaded && activeTab === PROFILE_CONTENT_TABS.REPLIES) loadReplieData();
        if (!su.initFollowingProfilesLoaded && activeTab === PROFILE_CONTENT_TABS.FOLLOWING) loadFollowingData();
        if (!su.initFollowersProfilesLoaded && activeTab === PROFILE_CONTENT_TABS.FOLLOWERS) loadFollowersData();
    }, [activeUserPubkey, activeTab]);

    return (
        <Tabs
            radius="md"
            defaultValue={PROFILE_CONTENT_TABS.NOTES}
            color={color}
            mt="lg"
            value={activeTab}
            onChange={(e) => handleActiveTabChange(e as PROFILE_CONTENT_TABS)}
            keepMounted={false}
        >
            <Tabs.List grow>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.NOTES} ml="xs">
                    Notes
                </Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.REPLIES}>Replies</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWERS}>Followers</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWING} mr="xs">
                    Following
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="notes">
                <Notes
                    notes={su.notes}
                    usersMetadata={[su.profile!]}
                    loading={loadingForNotes}
                    interactionStats={su.interactionStatsForNotes}
                    loadNotes={loadNotes}
                    replies={[]}
                />
            </Tabs.Panel>

            <Tabs.Panel value="replies">
                <Notes
                    notes={su.replies}
                    usersMetadata={[su.profile!]}
                    loading={loadingForReplies}
                    interactionStats={su.interactionStatsForReplies}
                    loadNotes={loadReplies}
                    // TODO: fetch replies
                    replies={[]}
                />
            </Tabs.Panel>

            <Tabs.Panel value="followers">
                <UserList
                    profiles={su.followersProfiles}
                    loading={loadingForFollowers}
                    pubkeys={followers}
                    loadUsers={loadFollowersProfiles}
                />
            </Tabs.Panel>

            <Tabs.Panel value="following">
                <UserList
                    profiles={su.followingProfiles}
                    loading={loadingForFollowing}
                    pubkeys={following}
                    loadUsers={loadFollowingProfiles}
                />
            </Tabs.Panel>
        </Tabs>
    );
}
