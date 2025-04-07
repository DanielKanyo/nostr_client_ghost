import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Box, Center, Flex, Loader } from "@mantine/core";

import { authUser, fetchUserMetadata, UserMetadata } from "../Service/service";
import { LoadingStateEnum, LoadingStates } from "../Util/util";
import Navigation from "./Navigation";

export default function Layout() {
    const [loadingState, setLoadingState] = useState<LoadingStates>(LoadingStateEnum.LOADING);
    const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authUserAndFetchUserMetadata = async () => {
            const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
            const storedPublicKey = localStorage.getItem("nostrPublicKey");

            if (storedPrivateKey && storedPublicKey) {
                try {
                    const pool = new SimplePool();
                    const publicKey = await authUser(storedPrivateKey, pool);

                    if (publicKey === storedPublicKey) {
                        setUserMetadata(await fetchUserMetadata(publicKey, pool));
                        setLoadingState(LoadingStateEnum.IDLE);
                    }
                } catch {
                    setLoadingState(LoadingStateEnum.REDIRECTING);
                    navigate("/");
                }
            } else {
                setLoadingState(LoadingStateEnum.REDIRECTING);
                navigate("/");
            }
        };

        authUserAndFetchUserMetadata();
    }, []);

    if (loadingState !== LoadingStateEnum.IDLE) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
            </Center>
        );
    }

    return (
        <Box m="0 auto">
            <Flex mih="100vh" justify="center" direction="row">
                <Box w={300} p="md">
                    <Navigation userMetadata={userMetadata} />
                </Box>
                <Box w={700} bg="rgba(0, 0, 0, .2)" p="md">
                    <Outlet />
                </Box>
                <Box w={300} p="md">
                    c
                </Box>
            </Flex>
        </Box>
    );
}
