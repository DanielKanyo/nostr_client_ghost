import { Outlet } from "react-router-dom";

import { Box, Center, Flex, Loader } from "@mantine/core";

import { useAuth } from "../Auth/AuthProvider";
import { LoadingStateEnum } from "../Util/util";
import Navigation from "./Navigation";

export default function Layout() {
    const { loadingState, userMetadata } = useAuth();

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
