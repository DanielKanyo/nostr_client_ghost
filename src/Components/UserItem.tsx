import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Divider, Flex, Group, Text, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { PROFILE_ROUTE_BASE } from "../Routes/routes";
import { encodeNProfile, encodeNPub } from "../Services/userService";
import { useAppSelector } from "../Store/hook";
import FollowOrUnfollowBtn from "./FollowOrUnfollowBtn";

interface UserItemProps {
    pubkey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
}

export default function UserItem({ pubkey, name, picture, displayName }: UserItemProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const { color } = useAppSelector((state) => state.primaryColor);
    const loggedInUser = useAppSelector((state) => state.user);
    const { hovered, ref } = useHover();
    const navigate = useNavigate();

    const bgColor = useMemo(() => {
        return computedColorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1];
    }, [computedColorScheme, theme.colors]);

    const handleContainerClick = (event: React.MouseEvent) => {
        if (
            event.target instanceof HTMLElement &&
            (event.target.closest("a") || event.target.closest("button") || event.target.closest("[role='button']"))
        ) {
            return;
        }
        navigate(`${PROFILE_ROUTE_BASE}/${encodeNProfile(pubkey)}`);
    };

    return (
        <>
            <Flex
                justify="space-between"
                align="center"
                p="md"
                ref={ref}
                style={{ backgroundColor: hovered ? bgColor : "transparent", cursor: "pointer" }}
                onClick={handleContainerClick}
            >
                <Group>
                    <Avatar src={picture} radius={45} size={45} />
                    <Flex direction="column" align="flex-start" justify="center">
                        <Box w={300}>
                            <Text ta="left" size="md" truncate="end">
                                {displayName}
                            </Text>
                            <Text ta="left" c="dimmed" size="sm" truncate="end">
                                {name ? `@${name}` : encodeNPub(pubkey)}
                            </Text>
                        </Box>
                    </Flex>
                </Group>
                <FollowOrUnfollowBtn loggedInUser={loggedInUser} pubkey={pubkey} color={color} />
            </Flex>
            <Divider />
        </>
    );
}
