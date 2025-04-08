import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Box, Center, Flex, Loader } from "@mantine/core";

import { authenticate, fetchUserMetadata } from "../Service/service";
import { updateAuthenticated, updateLoading, updateUser } from "../Store/Features/UserSlice";
import store from "../Store/store";
import GetStarted from "./GetStarted";
import Navigation from "./Navigation";

export default function MainLayout() {
    const user = useSelector((state: ReturnType<typeof store.getState>) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const authenticateUser = async () => {
            const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
            const storedPublicKey = localStorage.getItem("nostrPublicKey");

            if (storedPrivateKey && storedPublicKey) {
                try {
                    const pool = new SimplePool();
                    const publicKey = await authenticate(storedPrivateKey, pool);

                    if (publicKey === storedPublicKey) {
                        const metadata = await fetchUserMetadata(publicKey, pool);

                        if (metadata) {
                            dispatch(updateUser(metadata));
                        }

                        dispatch(updateAuthenticated(true));
                        dispatch(updateLoading(false));
                    } else {
                        throw new Error("Public key mismatch...");
                    }
                } catch {
                    localStorage.removeItem("nostrPrivateKey");
                    localStorage.removeItem("nostrPublicKey");

                    dispatch(updateLoading(false));
                }
            } else {
                dispatch(updateLoading(false));
            }
        };

        authenticateUser();
    }, []);

    if (user.loading) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
            </Center>
        );
    }

    if (!user.authenticated) {
        return <GetStarted />;
    }

    return (
        <Box m="0 auto">
            <Flex mih="100vh" justify="center" direction="row">
                <Box w={320} py="md" px="lg" style={{ borderRight: "1px solid var(--mantine-color-dark-4)" }}>
                    <Navigation />
                </Box>
                <Box w={680} bg="rgba(0, 0, 0, .2)">
                    <Outlet />
                </Box>
                <Box w={320} p="md" style={{ borderLeft: "1px solid var(--mantine-color-dark-4)" }}>
                    c
                </Box>
            </Flex>
        </Box>
    );
}
