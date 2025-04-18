import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Box, Flex, useMantineTheme } from "@mantine/core";

import PageLoader from "../Components/PageLoader";
import { authenticateUser, closePool, fetchUserMetadata, getFollowers, getFollowing } from "../Services/userService";
import { updatePrimaryColor } from "../Store/Features/primaryColorSlice";
import { updateUser, updateUserLoading } from "../Store/Features/userSlice";
import { useAppSelector } from "../Store/hook";
import GetStarted from "./GetStarted";
import Navigation from "./Navigation";

export default function Layout() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useDispatch();
    const theme = useMantineTheme();

    useEffect(() => {
        const primaryColor = localStorage.getItem("nostrPrimaryColor");

        if (primaryColor) {
            dispatch(updatePrimaryColor({ color: primaryColor, borderColor: theme.colors[primaryColor]?.[5] || primaryColor }));
        }
    }, [dispatch]);

    useEffect(() => {
        const authenticate = async () => {
            dispatch(updateUserLoading(true));

            const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
            const storedPublicKey = localStorage.getItem("nostrPublicKey");

            if (storedPrivateKey && storedPublicKey) {
                const pool = new SimplePool();

                try {
                    const publicKey = await authenticateUser(storedPrivateKey);

                    if (publicKey === storedPublicKey) {
                        const metadata = await fetchUserMetadata(pool, publicKey);
                        const [following, followers] = await Promise.all([getFollowing(pool, publicKey), getFollowers(pool, publicKey)]);

                        dispatch(
                            updateUser({
                                profile: metadata,
                                privateKey: storedPrivateKey,
                                publicKey,
                                followers,
                                following,
                                authenticated: true,
                                loading: false,
                            })
                        );
                    } else {
                        throw new Error("Public key mismatch...");
                    }
                } catch {
                    localStorage.removeItem("nostrPrivateKey");
                    localStorage.removeItem("nostrPublicKey");

                    closePool(pool);
                    dispatch(updateUserLoading(false));
                }
            } else {
                dispatch(updateUserLoading(false));
            }
        };

        authenticate();
    }, [dispatch]);

    if (user.loading) {
        return <PageLoader />;
    }

    if (!user.authenticated) {
        return <GetStarted />;
    }

    return (
        <Box m="0 auto">
            <Flex mih="100vh" justify="center" direction="row">
                <Box w={320} py="md" px="lg">
                    <Navigation />
                </Box>
                <Box>
                    <Outlet />
                </Box>
            </Flex>
        </Box>
    );
}
