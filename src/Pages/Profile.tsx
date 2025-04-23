import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Alert, Center, Loader } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import ProfileContent from "../Layouts/Profile/ProfileContent";
import ProfileHeader from "../Layouts/Profile/ProfileHeader";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";
import { closePool, decodeNProfileOrNPub, fetchUserMetadata, getFollowers, getFollowing } from "../Services/userService";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH, PROFILE_CONTENT_TABS } from "../Shared/utils";
import { resetSelectedUser, updateSelectedUserBasic } from "../Store/Features/selectedUserSlice";
import { useAppSelector } from "../Store/hook";

export default function Profile() {
    const { profileKey } = useParams<{ profileKey: string }>();
    const storedUser = useAppSelector((state) => state.user);
    const su = useAppSelector((state) => state.selectedUser);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>(PROFILE_CONTENT_TABS.NOTES);
    const dispatch = useDispatch();

    const nprofileData = useMemo(() => decodeNProfileOrNPub(profileKey!), [profileKey]);

    const isOwnProfile = nprofileData?.pubkey === storedUser.publicKey;

    const handleActiveTabChange = useCallback((tab: PROFILE_CONTENT_TABS) => {
        setActiveTab(tab);
    }, []);

    const loadUser = useCallback(async () => {
        setLoading(true);

        if (isOwnProfile) {
            dispatch(
                updateSelectedUserBasic({
                    pubkey: storedUser.publicKey,
                    profile: storedUser.profile,
                    followersPubkeys: storedUser.followers,
                    followingPubkeys: storedUser.following,
                })
            );

            setLoading(false);
            return;
        }

        const pool = new SimplePool();

        try {
            // TODO: handle relays stored in nprofileData
            const pubkey = nprofileData!.pubkey;
            const [profile, followingPubkeys, followersPubkeys] = await Promise.all([
                fetchUserMetadata(pool, pubkey),
                getFollowing(pool, pubkey),
                getFollowers(pool, pubkey),
            ]);

            dispatch(
                updateSelectedUserBasic({
                    pubkey,
                    profile,
                    followersPubkeys,
                    followingPubkeys,
                })
            );
        } catch (error) {
            setError("Fetching user details failed! Please try again later...");
        } finally {
            closePool(pool);
            setLoading(false);
        }
    }, [dispatch, profileKey]);

    useEffect(() => {
        if (su.pubkey !== nprofileData!.pubkey) {
            dispatch(resetSelectedUser());
            setActiveTab(PROFILE_CONTENT_TABS.NOTES);
            loadUser();
        }
    }, [profileKey]);

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <ScrollContainer>
                    {!loading && su.profile ? (
                        <>
                            <ProfileHeader
                                pubkey={su.pubkey}
                                name={su.profile.name}
                                displayName={su.profile.display_name}
                                about={su.profile.about}
                                picture={su.profile.picture}
                                banner={su.profile.banner}
                                website={su.profile.website}
                                followers={su.followersPubkeys}
                                following={su.followingPubkeys}
                                ownKey={isOwnProfile}
                                handleActiveTabChange={handleActiveTabChange}
                            />
                            <ProfileContent
                                activeUserPubkey={su.pubkey}
                                activeTab={activeTab}
                                followers={su.followersPubkeys}
                                following={su.followingPubkeys}
                                handleActiveTabChange={handleActiveTabChange}
                            />
                        </>
                    ) : (
                        <Center h={100}>
                            <Loader size={36} color="var(--mantine-color-dark-0)" type="dots" />
                        </Center>
                    )}

                    {error && (
                        <Alert
                            variant="light"
                            mx="lg"
                            color="red"
                            radius="md"
                            title="Something went wrong!"
                            icon={<IconExclamationCircle />}
                            mb="lg"
                        >
                            {error}
                        </Alert>
                    )}
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
