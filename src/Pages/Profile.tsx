import { useEffect, useMemo, useState } from "react";
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
import { NoteFilterOptions, PROFILE_CONTENT_TABS } from "../Shared/utils";
import { useAppSelector } from "../Store/hook";
import { UserMetadata } from "../Types/userMetadata";

export default function Profile() {
    const { key } = useParams<{ key: string }>();
    const storedUser = useAppSelector((state) => state.user);
    const [profile, setProfile] = useState<UserMetadata | null>(null);
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [ownKey, setOwnKey] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string | null>(PROFILE_CONTENT_TABS.NOTES);
    const [filterOption, setFilterOption] = useState<NoteFilterOptions>(NoteFilterOptions.Notes);

    const nprofileData = useMemo(() => decodeNProfileOrNPub(key!), [key]);

    // Reset states on nprofile change
    useEffect(() => {
        setProfile(null);
        setFollowers([]);
        setFollowers([]);
        setOwnKey(false);
        handleActiveTabChange(PROFILE_CONTENT_TABS.NOTES);
        setError("");
    }, [key]);

    useEffect(() => {
        // TODO: Check what happens when the user opens /profile without nprofile in the url
        if (!nprofileData) return;

        if (nprofileData.pubkey === storedUser.publicKey) {
            setOwnKey(true);
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

                const metadata = await fetchUserMetadata(pool, nprofileData.pubkey);
                const [following, followers] = await Promise.all([
                    getFollowing(pool, nprofileData.pubkey),
                    getFollowers(pool, nprofileData.pubkey),
                ]);

                setFollowers(followers);
                setFollowing(following);

                if (metadata) {
                    setProfile(metadata);
                }
            } catch (err) {
                setError("Fetching user details failed! Please try again later...");
            } finally {
                closePool(pool);
            }
        };

        fetchProfile();
    }, [nprofileData, storedUser.publicKey, storedUser.following]);

    const handleActiveTabChange = (tab: PROFILE_CONTENT_TABS) => {
        switch (tab) {
            case PROFILE_CONTENT_TABS.NOTES:
                setFilterOption(NoteFilterOptions.Notes);
                break;
            case PROFILE_CONTENT_TABS.REPLIES:
                setFilterOption(NoteFilterOptions.Replies);
                break;
            default:
                setFilterOption(NoteFilterOptions.Notes);
                break;
        }

        setActiveTab(tab);
    };

    return (
        <Content>
            <MainContainer width={680}>
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
                                ownKey={ownKey}
                                handleActiveTabChange={handleActiveTabChange}
                            />
                            <ProfileContent
                                pubkey={nprofileData!.pubkey}
                                activeTab={activeTab}
                                followers={followers}
                                following={following}
                                filterOption={filterOption}
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
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
