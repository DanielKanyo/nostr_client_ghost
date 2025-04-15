import { Link } from "react-router-dom";

import { Flex, Group, Avatar, Box, Tooltip, ActionIcon, Text, MantineColor } from "@mantine/core";
import { IconEyeShare, IconUserMinus, IconUserPlus } from "@tabler/icons-react";

import { PROFILE_ROUTE_BASE } from "../../Routes/routes";
import { encodeNPub, encodeNProfile } from "../../Services/userService";
import { UserState } from "../../Store/Features/userSlice";
import { useAppSelector } from "../../Store/hook";

interface UserItemProps {
    pubkey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
}

const FollowOrUnfollowBtn = ({ loggedInUser, pubkey, color }: { loggedInUser: UserState; pubkey: string; color: string }) => {
    if (loggedInUser.publicKey === pubkey) {
        return null;
    }

    return loggedInUser.following.includes(pubkey) ? (
        <Tooltip label="Unfollow User" withArrow>
            <ActionIcon aria-label="follow" variant="filled" size="xl" radius="xl" color="red">
                <IconUserMinus />
            </ActionIcon>
        </Tooltip>
    ) : (
        <Tooltip label="Follow User" withArrow>
            <ActionIcon aria-label="follow" variant="filled" size="xl" radius="xl" color={color}>
                <IconUserPlus />
            </ActionIcon>
        </Tooltip>
    );
};

export default function UserItem({ pubkey, name, picture, displayName }: UserItemProps) {
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;
    const loggedInUser = useAppSelector((state) => state.user);

    const iconProps = {
        variant: "light" as const,
        color: "gray",
        size: "xl" as const,
        radius: "xl" as const,
    };

    return (
        <Flex key={pubkey} justify="space-between" align="center">
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
            <Group gap="xs">
                <Tooltip label="View Profile" withArrow>
                    <ActionIcon aria-label="dots" {...iconProps} component={Link} to={`${PROFILE_ROUTE_BASE}/${encodeNProfile(pubkey)}`}>
                        <IconEyeShare />
                    </ActionIcon>
                </Tooltip>
                <FollowOrUnfollowBtn loggedInUser={loggedInUser} pubkey={pubkey} color={primaryColor} />
            </Group>
        </Flex>
    );
}
