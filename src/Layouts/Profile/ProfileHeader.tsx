import {
    Avatar,
    BackgroundImage,
    Box,
    Button,
    Flex,
    Group,
    NumberFormatter,
    Text,
    useComputedColorScheme,
    useMantineTheme,
} from "@mantine/core";

import { PROFILE_CONTENT_TABS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import ProfileActions from "./ProfileActions";

interface ProfileHeaderProps {
    pubkey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
    banner: string | undefined;
    about: string | undefined;
    website: string | undefined;
    followers: string[];
    following: string[];
    ownKey: boolean;
    handleActiveTabChange: (value: PROFILE_CONTENT_TABS) => void;
}

export default function ProfileHeader({
    pubkey,
    name,
    displayName,
    about,
    website,
    banner,
    picture,
    followers,
    following,
    ownKey,
    handleActiveTabChange,
}: ProfileHeaderProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const { color } = useAppSelector((state) => state.primaryColor);

    const countStyle = { fontSize: 14, fontWeight: 700 };
    const buttonProps = {
        variant: "light" as const,
        color: "gray",
        size: "xs" as const,
        radius: "xl" as const,
    };

    return (
        <Box w="100%">
            <BackgroundImage
                src={banner ?? ""}
                h={200}
                pos="relative"
                style={{
                    backgroundColor: theme.colors[color][6],
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
                    color={color}
                    variant="filled"
                    left={80}
                    style={{ outline: `10px solid ${computedColorScheme === "dark" ? theme.colors.dark[7] : "white"}` }}
                />
            </BackgroundImage>
            <ProfileActions ownKey={ownKey} pubkey={pubkey} website={website} />
            <Group justify="space-between" px="lg" align="flex-end">
                <Flex direction="column">
                    <Box w={300}>
                        <Text ta="left" fz={26} truncate="end">
                            {displayName ?? "Undefined"}
                        </Text>
                        <Text ta="left" c="dimmed" fz={18} lh={1.2} truncate="end">
                            @{name ?? "Undefined"}
                        </Text>
                    </Box>
                </Flex>
                <Flex gap="xs">
                    <Button {...buttonProps} onClick={() => handleActiveTabChange(PROFILE_CONTENT_TABS.FOLLOWERS)}>
                        <Text style={countStyle}>
                            <NumberFormatter thousandSeparator value={followers.length} />{" "}
                        </Text>
                        <Text ml={6} fz={14} c="dimmed">
                            Followers
                        </Text>
                    </Button>
                    <Button {...buttonProps} onClick={() => handleActiveTabChange(PROFILE_CONTENT_TABS.FOLLOWING)}>
                        <Text style={countStyle}>
                            <NumberFormatter thousandSeparator value={following.length} />{" "}
                        </Text>
                        <Text ml={6} fz={14} c="dimmed">
                            Following
                        </Text>
                    </Button>
                </Flex>
            </Group>
            {about && (
                <Text px="lg" pt="lg" fz={16} lineClamp={4}>
                    {about}
                </Text>
            )}
        </Box>
    );
}
