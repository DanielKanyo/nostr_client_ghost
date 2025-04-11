import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Center, Loader } from "@mantine/core";

import Content from "../Layouts/Content";
import MainContainer from "../Layouts/MainContainer";
import ProfileContent from "../Layouts/Profile/ProfileContent";
import ProfileHeader from "../Layouts/Profile/ProfileHeader";
import ScrollContainer from "../Layouts/ScrollContainer";
import SideContainer from "../Layouts/SideContainer";
import { closePool, decodeNProfile, fetchUserMetadata } from "../Services/userService";
import { useAppSelector } from "../Store/hook";
import { UserMetadata } from "../Types/userMetadata";

export default function Profile() {
    const { nprofile } = useParams<{ nprofile: string }>();
    const storedUser = useAppSelector((state) => state.user);
    const primaryColor = useAppSelector((state) => state.primaryColor);
    const [userData, setUserData] = useState<UserMetadata | null>(null);
    const [error, setError] = useState<string>("");

    const nprofileData = useMemo(() => decodeNProfile(nprofile!), [nprofile]);

    // Reset states on nprofile
    useEffect(() => {
        setUserData(null);
        setError("");
    }, [nprofile]);

    useEffect(() => {
        // TODO: Check what happens when the user opens /profile without nprofile in the url
        if (!nprofileData) return;

        if (nprofileData.pubkey === storedUser.publicKey) {
            setUserData(storedUser.data);
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

                if (metadata) {
                    setUserData(metadata);
                }
            } catch (err) {
                setError("Error fetching user metadata...");
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
                            />
                            <ProfileContent primaryColor={primaryColor} />
                        </>
                    ) : (
                        <Center h={100}>
                            <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
                        </Center>
                    )}
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={320}>Side Box</SideContainer>
        </Content>
    );
}
