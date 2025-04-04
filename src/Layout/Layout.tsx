import { Outlet } from "react-router-dom";

import { Box, Flex } from "@mantine/core";

import Navigation from "./Navigation";

export default function Layout() {
    return (
        <Box m="0 auto">
            <Flex mih="100vh" justify="center" direction="row">
                <Box w={300} p="md">
                    <Navigation />
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
