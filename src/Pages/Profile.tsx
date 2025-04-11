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
import { closePool, decodeNProfile, fetchUserMetadata, getFollowers, getFollowing } from "../Services/userService";
import { useAppSelector } from "../Store/hook";
import { UserMetadata } from "../Types/userMetadata";

export default function Profile() {
    const { nprofile } = useParams<{ nprofile: string }>();
    const storedUser = useAppSelector((state) => state.user);
    const primaryColor = useAppSelector((state) => state.primaryColor);
    const [userData, setUserData] = useState<UserMetadata | null>(null);
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [ownKey, setOwnKey] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const nprofileData = useMemo(() => decodeNProfile(nprofile!), [nprofile]);

    // Reset states on nprofile change
    useEffect(() => {
        setUserData(null);
        setError("");
    }, [nprofile]);

    useEffect(() => {
        // TODO: Check what happens when the user opens /profile without nprofile in the url
        if (!nprofileData) return;

        if (nprofileData.pubkey === storedUser.publicKey) {
            setOwnKey(true);
            setUserData(storedUser.profile);
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
                    setUserData(metadata);
                }
            } catch (err) {
                setError("Fetching user details failed! Please try again later...");
            } finally {
                closePool(pool);
            }
        };

        fetchProfile();
    }, [nprofileData, storedUser.publicKey]);

    return (
        <Content>
            <MainContainer width={680}>
                <ScrollContainer>
                    {userData ? (
                        <>
                            <ProfileHeader
                                publicKey={nprofileData.pubkey}
                                name={userData.name}
                                displayName={userData.display_name}
                                about={userData.about}
                                picture={userData.picture}
                                banner={userData.banner}
                                primaryColor={primaryColor}
                                followers={followers}
                                following={following}
                                ownKey={ownKey}
                            />
                            <ProfileContent primaryColor={primaryColor} />
                        </>
                    ) : (
                        <Center h={100}>
                            <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
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
