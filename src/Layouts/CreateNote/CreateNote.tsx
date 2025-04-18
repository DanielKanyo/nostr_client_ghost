import { CSSProperties, useState } from "react";

import { Avatar, Box, Button, Divider, Flex, Group, Modal, Stack, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSend } from "@tabler/icons-react";

import { useAppSelector } from "../../Store/hook";
import classes from "./textarea.module.css";

export default function CreateNote() {
    const user = useAppSelector((state) => state.user);
    const { color, borderColor } = useAppSelector((state) => state.primaryColor);
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [noteContent, setNoteContent] = useState("");

    const handleClose = () => {
        setLoading(false);
        setNoteContent("");
        close();
    };

    const postNote = () => {
        setLoading(true);

        // TODO: Add logic here
    };

    // const borderColor = theme.colors[primaryColor]?.[5] || primaryColor;

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
