import { Outlet } from "react-router-dom";

import { Box, Center, Flex, Loader } from "@mantine/core";

import { useAuth } from "../Auth/AuthProvider";
import GetStarted from "./GetStarted";
import Navigation from "./Navigation";

export default function MainLayout() {
    const { loading, userAuthenticated, userMetadata } = useAuth();

    if (loading) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader size={40} color="var(--mantine-color-dark-0)" type="dots" />
            </Center>
        );
    }

    if (!userAuthenticated) {
        return <GetStarted />;
    }

    return (
        <Box m="0 auto">
            <Flex mih="100vh" justify="center" direction="row">
                <Box w={320} py="md" px="lg" style={{ borderRight: "1px solid var(--mantine-color-dark-4)" }}>
                    <Navigation userMetadata={userMetadata} />
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
