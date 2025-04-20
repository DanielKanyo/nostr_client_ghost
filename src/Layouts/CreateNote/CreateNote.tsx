import { CSSProperties, useState } from "react";

import { SimplePool } from "nostr-tools";

import { Alert, Avatar, Box, Button, Divider, Flex, Group, Modal, Stack, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconExclamationCircle, IconSend } from "@tabler/icons-react";

import { publishNote } from "../../Services/noteService";
import { closePool } from "../../Services/userService";
import classes from "../../Shared/Styles/inputFocus.module.css";
import { useAppSelector } from "../../Store/hook";

interface CreateNoteProps {
    reloadNotes: () => void;
}

export default function CreateNote({ reloadNotes }: CreateNoteProps) {
    const user = useAppSelector((state) => state.user);
    const { color, borderColor } = useAppSelector((state) => state.primaryColor);
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [noteContent, setNoteContent] = useState("");

    const handleClose = () => {
        setLoading(false);
        setNoteContent("");
        close();
    };

    const postNote = async () => {
        setLoading(true);

        const pool = new SimplePool();

        try {
            await publishNote(pool, noteContent, user.privateKey);

            reloadNotes();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to publish note! Please try again later...");
        } finally {
            closePool(pool);
            setLoading(false);
            close();
        }
    };

    return (
        <>
            <Box onClick={open} style={{ cursor: "pointer" }}>
                <Flex align="center" gap="sm" style={{ pointerEvents: "none" }} p="md">
                    <Avatar src={user?.profile?.picture} size="md" />
                    <TextInput size="md" radius="xl" placeholder="Share your thoughts..." w="100%" readOnly />
                </Flex>
                <Divider />
            </Box>
            <Modal
                opened={opened}
                onClose={handleClose}
                withCloseButton={false}
                overlayProps={{ blur: 3 }}
                padding="lg"
                radius="lg"
                size="lg"
            >
                <Stack>
                    <Flex gap="sm">
                        <Avatar src={user?.profile?.picture} size="md" />
                        <Textarea
                            size="md"
                            radius="md"
                            w="100%"
                            autosize
                            minRows={4}
                            classNames={classes}
                            data-autofocus
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.currentTarget.value)}
                            style={{ "--input-border-color-focus": borderColor } as CSSProperties}
                        />
                    </Flex>
                    {error && (
                        <Alert
                            variant="light"
                            color="red"
                            radius="md"
                            title="Something went wrong!"
                            icon={<IconExclamationCircle />}
                            ml={50}
                        >
                            {error}
                        </Alert>
                    )}
                    <Group justify="flex-end" gap="sm">
                        <Button variant="light" radius="xl" color="gray" size="md" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            radius="xl"
                            color={color}
                            loading={loading}
                            loaderProps={{ type: "dots" }}
                            leftSection={<IconSend size={21} />}
                            size="md"
                            onClick={postNote}
                        >
                            Post
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
