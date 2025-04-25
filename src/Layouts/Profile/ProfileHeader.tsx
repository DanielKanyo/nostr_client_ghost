import { useState } from "react";

import {
    Avatar,
    BackgroundImage,
    Box,
    Button,
    Center,
    Flex,
    Group,
    NumberFormatter,
    Text,
    useComputedColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconZoomIn } from "@tabler/icons-react";

import { ImageViewer } from "../../Components/ImageViewer";
import { PROFILE_CONTENT_TABS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import ProfileActions from "./ProfileActions";
import "./style.css";

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

interface zoomOverlayProps {
    img: string;
    className: string;
    handleImageClick: (value: string) => void;
}

const ZoomOverlay = ({ img, className, handleImageClick }: zoomOverlayProps) => {
    return (
        <Center className={className} pos="absolute" top={0} w="100%" h="100%" onClick={() => handleImageClick(img)}>
            <IconZoomIn size={32} />
        </Center>
    );
};

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
    const [opened, setOpened] = useState<boolean>(false);
    const [imageToOpen, setImageToOpen] = useState<string>("");
    const { hovered, ref } = useHover();

    const countStyle = { fontSize: 14, fontWeight: 700 };
    const buttonProps = {
        variant: "light" as const,
        color: "gray",
        size: "xs" as const,
        radius: "xl" as const,
    };

    const handleImageClick = (img: string) => {
        setImageToOpen(img);
        setOpened(true);
    };

    return (
        <>
            <Box w="100%">
                <BackgroundImage
                    src={banner ?? ""}
                    h={banner && hovered ? 220 : 200}
                    pos="relative"
                    style={{
                        backgroundColor: theme.colors[color][6],
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        transition: "0.2s",
                    }}
                    ref={ref}
                >
                    {banner && (
                        <div style={{ position: "absolute", top: 0, width: "100%", height: "100%" }}>
                            <ZoomOverlay img={banner} className="zoom-icon-container banner" handleImageClick={handleImageClick} />
                        </div>
                    )}
                    <div style={{ position: "absolute", bottom: -65, left: 80 }}>
                        <Avatar
                            src={picture}
                            size={160}
                            radius={160}
                            color={color}
                            variant="filled"
                            style={{ outline: `10px solid ${computedColorScheme === "dark" ? theme.colors.dark[7] : "white"}` }}
                        />
                        {picture && (
                            <ZoomOverlay img={picture} className="zoom-icon-container picture" handleImageClick={handleImageClick} />
                        )}
                    </div>
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

            <ImageViewer opened={opened} setOpened={setOpened} fullImageSrc={imageToOpen} alt="picture" />
        </>
    );
}
