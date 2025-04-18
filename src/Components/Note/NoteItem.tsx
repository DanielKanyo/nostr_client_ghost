import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { NostrEvent } from "nostr-tools";

import { Avatar, Container, Divider, Flex, Stack, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { EVENT_ROUTE_BASE, PROFILE_ROUTE_BASE } from "../../Routes/routes";
import { encodeNEvent } from "../../Services/noteService";
import { encodeNProfile } from "../../Services/userService";
import { extractImageUrls, extractVideoUrls } from "../../Shared/utils";
import { UserMetadata } from "../../Types/userMetadata";
import NoteActionMore from "./NoteActionMore";
import NoteBody from "./NoteBody";
import NoteFooter from "./NoteFooter";
import NoteHeader from "./NoteHeader";

interface NoteItemProps {
    note: NostrEvent;
    usersMetadata: UserMetadata[];
}

export default function NoteItem({ note, usersMetadata }: NoteItemProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");
    const nevent = encodeNEvent(note.id);
    const navigate = useNavigate();
    const { hovered, ref } = useHover();

    const { text: text1, images } = useMemo(() => extractImageUrls(note.content), [note.content]);
    const { text: textToDisplay, videos } = useMemo(() => extractVideoUrls(text1), [text1]);

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
                                <NoteBody noteId={note.id} text={textToDisplay} images={images} videos={videos} />
                            </Stack>
                            <NoteActionMore note={note} usersMetadata={userMetadata} nevent={nevent} />
                        </Flex>
                        <NoteFooter handleActionIconClick={handleActionIconClick} />
                    </Container>
                </Flex>
            </Container>
            <Divider />
        </>
    );
}
