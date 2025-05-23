import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Box, Flex, useMantineTheme } from "@mantine/core";

import PageLoader from "../Components/PageLoader";
import { authenticateUser, closePool, fetchUserMetadata, getFollowers, getFollowing } from "../Services/userService";
import { DEFAULT_SIDE_CONTAINER_WIDTH } from "../Shared/utils";
import { updateMutedAccounts } from "../Store/Features/mutedAccountsSlice";
import { updatePrimaryColor } from "../Store/Features/primaryColorSlice";
import { setRelays } from "../Store/Features/relaysSlice";
import { updateUser, updateUserLoading } from "../Store/Features/userSlice";
import { useAppSelector } from "../Store/hook";
import GetStarted from "./GetStarted";
import Navigation from "./Navigation";

export default function Layout() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useDispatch();
    const theme = useMantineTheme();

    const handlePrimaryColorInLocalStorage = (primaryColor: string | null) => {
        if (primaryColor) {
            dispatch(updatePrimaryColor({ color: primaryColor, borderColor: theme.colors[primaryColor]?.[5] || primaryColor }));
        } else {
            dispatch(updatePrimaryColor({ color: "violet", borderColor: theme.colors.violet[5] }));
        }
    };

    const handleRelaysInLocalStorage = (relays: string | null) => {
        if (relays) {
            dispatch(setRelays(JSON.parse(relays)));
        }
    };

    const handleMutedAccountsInLocalStorage = (mutedAccounts: string | null) => {
        if (mutedAccounts) {
            dispatch(updateMutedAccounts(JSON.parse(mutedAccounts)));
        }
    };

    useEffect(() => {
        handlePrimaryColorInLocalStorage(localStorage.getItem("nostrPrimaryColor"));
        handleRelaysInLocalStorage(localStorage.getItem("nostrRelays"));
        handleMutedAccountsInLocalStorage(localStorage.getItem("nostrMutedAccounts"));
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
                <Box w={DEFAULT_SIDE_CONTAINER_WIDTH} py="md" px="lg">
                    <Navigation />
                </Box>
                <Box>
                    <Outlet />
                </Box>
            </Flex>
        </Box>
    );
}
