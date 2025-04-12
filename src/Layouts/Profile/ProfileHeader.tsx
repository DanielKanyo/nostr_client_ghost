import { Avatar, BackgroundImage, Box, Flex, Group, Text, useComputedColorScheme, useMantineTheme } from "@mantine/core";

import FollowersAndFollowing from "./FollowersAndFollowing";
import ProfileActions from "./ProfileActions";

interface ProfileHeaderProps {
    publicKey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
    banner: string | undefined;
    about: string | undefined;
    primaryColor: string;
    followers: string[];
    following: string[];
    ownKey: boolean;
}

export default function ProfileHeader({
    publicKey,
    name,
    displayName,
    about,
    banner,
    picture,
    primaryColor,
    followers,
    following,
    ownKey,
}: ProfileHeaderProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");

    return (
        <Box w="100%">
            <BackgroundImage
                src={banner ?? ""}
                h={200}
                pos="relative"
                style={{
                    backgroundColor: theme.colors[primaryColor][6],
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                }}
            >
                <Avatar
                    src={picture}
                    size={160}
                    radius={160}
                    pos="absolute"
                    bottom={-65}
                    color={primaryColor}
                    variant="filled"
                    left={80}
                    style={{ outline: `10px solid ${computedColorScheme === "dark" ? theme.colors.dark[7] : "white"}` }}
                />
            </BackgroundImage>
            <ProfileActions ownKey={ownKey} publicKey={publicKey} primaryColor={primaryColor} />
            <Group justify="space-between" px="lg" align="flex-end">
                <Flex direction="column">
                    <Box w={300}>
                        <Text ta="left" fz={26} truncate="end">
                            {displayName ?? "Undefined"}
                        </Text>
                        <Text ta="left" c="dimmed" fz={18} lh={1} truncate="end">
                            @{name ?? "Undefined"}
                        </Text>
                    </Box>
                </Flex>
                <FollowersAndFollowing followers={followers} following={following} />
            </Group>
            {about && (
                <Text px="lg" pt="lg" fz={16}>
                    {about}
                </Text>
            )}
        </Box>
    );
}
