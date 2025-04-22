import { useEffect, useMemo, useState, useCallback } from "react";
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
import { useAppSelector } from "../Store/hook";
import { UserMetadata } from "../Types/userMetadata";

export default function Profile() {
    const { key } = useParams<{ key: string }>();
    const storedUser = useAppSelector((state) => state.user);
    const [profile, setProfile] = useState<UserMetadata | null>(null);
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<string>(PROFILE_CONTENT_TABS.NOTES);

    const nprofileData = useMemo(() => decodeNProfileOrNPub(key!), [key]);

    const isOwnProfile = nprofileData?.pubkey === storedUser.publicKey;

    const handleActiveTabChange = useCallback((tab: PROFILE_CONTENT_TABS) => {
        setActiveTab(tab);
    }, []);

    useEffect(() => {
        // Reset states on profile switch
        setProfile(null);
        setFollowers([]);
        setFollowing([]);
        setError("");
        handleActiveTabChange(PROFILE_CONTENT_TABS.NOTES);
    }, [key, handleActiveTabChange]);

    useEffect(() => {
        if (!nprofileData) return;

        if (isOwnProfile) {
            setProfile(storedUser.profile);
            setFollowers(storedUser.followers);
            setFollowing(storedUser.following);
            return;
        }

        const fetchProfile = async () => {
            const pool = new SimplePool();

            try {
                // TODO: handle relays
                // const relays = nprofileData.relays?.length
                //     ? nprofileData.relays
                //     : ["wss://nos.lol", "wss://relay.damus.io"];

                const [metadata, followingList, followersList] = await Promise.all([
                    fetchUserMetadata(pool, nprofileData.pubkey),
                    getFollowing(pool, nprofileData.pubkey),
                    getFollowers(pool, nprofileData.pubkey),
                ]);

                setProfile(metadata ?? null);
                setFollowing(followingList);
                setFollowers(followersList);
            } catch {
                setError("Fetching user details failed! Please try again later...");
            } finally {
                closePool(pool);
            }
        };

        fetchProfile();
    }, [nprofileData, isOwnProfile, storedUser]);

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <ScrollContainer>
                    {profile ? (
                        <>
                            <ProfileHeader
                                pubkey={nprofileData!.pubkey}
                                name={profile.name}
                                displayName={profile.display_name}
                                about={profile.about}
                                picture={profile.picture}
                                banner={profile.banner}
                                website={profile.website}
                                followers={followers}
                                following={following}
                                ownKey={isOwnProfile}
                                handleActiveTabChange={handleActiveTabChange}
                            />
                            <ProfileContent
                                pubkey={nprofileData!.pubkey}
                                activeTab={activeTab}
                                followers={followers}
                                following={following}
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
