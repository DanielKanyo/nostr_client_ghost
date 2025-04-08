import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Box, Flex, useComputedColorScheme, useMantineTheme } from "@mantine/core";

import GetStarted from "../Components/GetStarted";
import Navigation from "../Components/Navigation";
import PageLoader from "../Components/PageLoader";
import { authenticate, fetchUserMetadata } from "../Services/service";
import { updateAuthenticated, updateLoading, updateUser } from "../Store/Features/UserSlice";
import store from "../Store/store";

export default function MainLayout() {
    const user = useSelector((state: ReturnType<typeof store.getState>) => state.user);
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const dispatch = useDispatch();

    const borderColor = computedColorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];

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
        return <PageLoader />;
    }

    if (!user.authenticated) {
        return <GetStarted />;
    }

    return (
        <Box m="0 auto">
            <Flex mih="100vh" justify="center" direction="row">
                <Box w={320} py="md" px="lg" style={{ borderRight: `1px solid ${borderColor}` }}>
                    <Navigation />
                </Box>
                <Box w={680}>
                    <Outlet />
                </Box>
                <Box w={320} p="md" style={{ borderLeft: `1px solid ${borderColor}` }}>
                    c
                </Box>
            </Flex>
        </Box>
    );
}
