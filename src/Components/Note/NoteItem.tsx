import { JSX, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { NostrEvent } from "nostr-tools";

import {
    ActionIcon,
    Avatar,
    Card,
    Container,
    Divider,
    Flex,
    Image,
    Menu,
    Stack,
    Text,
    TypographyStylesProvider,
    useComputedColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconBlockquote, IconDots, IconGridGoldenratio, IconKey, IconLink } from "@tabler/icons-react";

import { EVENT_ROUTE_BASE, PROFILE_ROUTE_BASE } from "../../Routes/routes";
import { encodeNEvent } from "../../Services/noteService";
import { encodeNProfile } from "../../Services/userService";
import { extractImageUrls } from "../../Shared/utils";
import { UserMetadata } from "../../Types/userMetadata";
import NoteActions from "./NoteActions";
import NoteHeader from "./NoteHeader";

interface NoteItemProps {
    note: NostrEvent;
    usersMetadata: UserMetadata[];
}

const replaceNostrTags = (content: string, replaceWithString: string = "user"): JSX.Element[] => {
    // TODO: provide valid replaceWithString
    const nostrRegex = /nostr:nprofile[0-9a-z]+/g;
    const parts = content.split(nostrRegex);
    const matches = content.match(nostrRegex) || [];

    // Map through the parts and intersperse with Link components
    const elements: JSX.Element[] = [];

    parts.forEach((part, index) => {
        elements.push(<span key={`part-${index}`}>{part}</span>);

        if (matches[index]) {
            const to = `${PROFILE_ROUTE_BASE}/${matches[index].replace("nostr:", "")}`;

            elements.push(
                <Link key={`link-${index}`} to={to}>
                    @{replaceWithString}
                </Link>
            );
        }
    });

    return elements;
};

export default function NoteItem({ note, usersMetadata }: NoteItemProps) {
    const { text, images } = extractImageUrls(note.content);
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const [opened, setOpened] = useState(false);
    const nevent = encodeNEvent(note.id);
    const navigate = useNavigate();
    const { hovered, ref } = useHover();

    const bgColor = useMemo(() => {
        return computedColorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1];
    }, [computedColorScheme, theme.colors]);

    const userMetadata = useMemo(() => usersMetadata.find((u) => u.pubkey === note.pubkey), [usersMetadata, note.pubkey]);

    const displayName = useMemo(() => {
        return userMetadata?.display_name || userMetadata?.name || `${note.pubkey.slice(0, 8)}...`;
    }, [userMetadata, note.pubkey]);

    const nprofile = useMemo(() => {
        if (userMetadata) {
            return encodeNProfile(userMetadata.pubkey);
        }
        return null;
    }, [userMetadata]);

    const handleContainerClick = (event: React.MouseEvent) => {
        if (
            event.target instanceof HTMLElement &&
            (event.target.closest("a") || event.target.closest("button") || event.target.closest("[role='button']"))
        ) {
            return;
        }
        navigate(`${EVENT_ROUTE_BASE}/${nevent}`);
    };

    const handleAvatarClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (nprofile) {
            navigate(`${PROFILE_ROUTE_BASE}/${nprofile}`);
        }
    };

    const handleActionIconClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        // Add your ActionIcon logic here (e.g., bookmark, like)
        console.log("Action btn clicked");
    };

    return (
        <>
            <Container
                px="md"
                pt="md"
                pb="xs"
                ref={ref}
                style={{ backgroundColor: hovered ? bgColor : "transparent", cursor: "pointer" }}
                onClick={handleContainerClick}
            >
                <Flex>
                    <Avatar src={userMetadata?.picture} radius={45} size={45} onClick={handleAvatarClick} />
                    <Container w="100%" p={0}>
                        <Flex>
                            <Stack w="100%" gap="sm" pl="lg">
                                <NoteHeader displayName={displayName} createdAt={note.created_at} />
                                <Text style={{ whiteSpace: "pre-line" }} lineClamp={9} component="div">
                                    <TypographyStylesProvider>
                                        <div>{replaceNostrTags(text)}</div>
                                    </TypographyStylesProvider>
                                </Text>
                                {images.length > 0 && (
                                    <Card withBorder radius="lg" p={0} style={{ overflow: "hidden" }}>
                                        <Image src={images[0]} alt="note-image" style={{ width: "100%" }} />
                                    </Card>
                                )}
                            </Stack>

                            <Menu shadow="md" position="bottom-end" radius="md">
                                <Menu.Target>
                                    <ActionIcon
                                        aria-label="dots"
                                        variant="subtle"
                                        size={28}
                                        color="gray"
                                        radius="xl"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <IconDots size={18} color="gray" />
                                    </ActionIcon>
                                </Menu.Target>

                                {/* TODO */}
                                <Menu.Dropdown>
                                    <Menu.Label>Note</Menu.Label>
                                    <Menu.Item leftSection={<IconLink size={14} />}>Copy Note Link</Menu.Item>
                                    <Menu.Item leftSection={<IconBlockquote size={14} />}>Copy Note Text</Menu.Item>
                                    <Menu.Item leftSection={<IconGridGoldenratio size={14} />}>Copy Note Id</Menu.Item>
                                    <Menu.Label>User</Menu.Label>
                                    <Menu.Item leftSection={<IconKey size={14} />}>Copy User Public Key</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Flex>
                        <NoteActions handleActionIconClick={handleActionIconClick} />
                    </Container>
                </Flex>
            </Container>
            <Divider />

            <Menu opened={opened} onChange={setOpened}>
                {/* Menu content */}
            </Menu>
        </>
    );
}
