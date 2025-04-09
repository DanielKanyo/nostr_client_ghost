import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Box, Flex } from "@mantine/core";

import GetStarted from "../Components/GetStarted";
import PageLoader from "../Components/PageLoader";
import { authenticate, fetchUserMetadata } from "../Services/service";
import { updatePrimaryColor } from "../Store/Features/primaryColorSlice";
import { updateAuthenticated, updateLoading, updateUser } from "../Store/Features/userSlice";
import { useAppSelector } from "../Store/hook";
import Navigation from "./Navigation";

export default function Layout() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const primaryColor = localStorage.getItem("nostrPrimaryColor");

        if (primaryColor) {
            dispatch(updatePrimaryColor(primaryColor));
        }
    }, [dispatch]);

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
