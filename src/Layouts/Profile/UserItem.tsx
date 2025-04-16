import { Link } from "react-router-dom";

import { Flex, Group, Avatar, Box, Tooltip, ActionIcon, Text, MantineColor, Divider } from "@mantine/core";
import { IconEyeShare } from "@tabler/icons-react";

import FollowOrUnfollowBtn from "../../Components/FollowOrUnfollowBtn";
import { PROFILE_ROUTE_BASE } from "../../Routes/routes";
import { encodeNPub, encodeNProfile } from "../../Services/userService";
import { useAppSelector } from "../../Store/hook";

interface UserItemProps {
    pubkey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
}

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
        <>
            <Flex justify="space-between" align="center" p="md">
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
                        <ActionIcon
                            aria-label="dots"
                            {...iconProps}
                            component={Link}
                            to={`${PROFILE_ROUTE_BASE}/${encodeNProfile(pubkey)}`}
                        >
                            <IconEyeShare />
                        </ActionIcon>
                    </Tooltip>
                    <FollowOrUnfollowBtn loggedInUser={loggedInUser} pubkey={pubkey} color={primaryColor} />
                </Group>
            </Flex>
            <Divider />
        </>
    );
}
