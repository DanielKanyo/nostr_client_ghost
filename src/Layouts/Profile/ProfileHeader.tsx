import {
    Avatar,
    BackgroundImage,
    Box,
    Button,
    Flex,
    Group,
    MantineColor,
    NumberFormatter,
    Text,
    useComputedColorScheme,
    useMantineTheme,
} from "@mantine/core";

import { PROFILE_CONTENT_TABS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import ProfileActions from "./ProfileActions";

interface ProfileHeaderProps {
    publicKey: string;
    name: string | undefined;
    displayName: string | undefined;
    picture: string | undefined;
    banner: string | undefined;
    about: string | undefined;
    website: string | undefined;
    followers: string[];
    following: string[];
    ownKey: boolean;
    setActiveTab: (value: string | null) => void;
}

export default function ProfileHeader({
    publicKey,
    name,
    displayName,
    about,
    website,
    banner,
    picture,
    followers,
    following,
    ownKey,
    setActiveTab,
}: ProfileHeaderProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;

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
            <ProfileActions ownKey={ownKey} publicKey={publicKey} website={website} />
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
                <Flex gap="xs">
                    <Button {...buttonProps} onClick={() => setActiveTab(PROFILE_CONTENT_TABS.FOLLOWERS)}>
                        <Text style={countStyle}>
                            <NumberFormatter thousandSeparator value={followers.length} />{" "}
                        </Text>
                        <Text ml={6} fz={14} c="dimmed">
                            Followers
                        </Text>
                    </Button>
                    <Button {...buttonProps} onClick={() => setActiveTab(PROFILE_CONTENT_TABS.FOLLOWING)}>
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
