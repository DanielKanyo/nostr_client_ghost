import { useState } from "react";

import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";

import { generateKeyPair, publishProfile } from "../Services/authService";

interface SignUpModalProps {
    opened: boolean;
    close: () => void;
}

export default function SignUpModal({ opened, close }: SignUpModalProps) {
    const [name, setName] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [website, setWebsite] = useState<string>("");
    const [picture, setPicture] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSaveProfile = async () => {
        setLoading(true);

        const { privateKey, publicKey } = generateKeyPair();
        const metadata = { name, displayName, website, picture, about };

        try {
            // TODO: Finish
            // await publishProfile(privateKey, metadata);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed...");
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Create Your Nostr Account"
            centered
            overlayProps={{ blur: 3 }}
            padding="lg"
            radius="md"
            size="60rem"
        >
            <Group mt="lg" grow gap="lg">
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Name"
                    description="Pick a short name e.g. Satoshi"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Click here and enter your username"
                    withAsterisk
                />
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Display Name"
                    description="Pick a longer display name e.g. Satoshi Nakamoto"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    placeholder="Click here and enter your display name"
                    withAsterisk
                />
            </Group>
            <Group mt="lg" grow gap="lg">
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.currentTarget.value)}
                    placeholder="https://yourwebsite.com"
                />
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Profile Picture URL"
                    value={picture}
                    onChange={(e) => setPicture(e.currentTarget.value)}
                    placeholder="Enter the url to your profile picture"
                />
            </Group>
            <Textarea
                mt="lg"
                label="About Me"
                placeholder="Say some words about yourself"
                variant="filled"
                size="md"
                radius="md"
                value={about}
                onChange={(e) => setAbout(e.currentTarget.value)}
            />
            <Group mt="xl" justify="flex-end">
                <Button variant="light" radius="md" color="gray" onClick={close}>
                    Cancel
                </Button>
                <Button
                    variant="filled"
                    radius="md"
                    color="violet"
                    onClick={handleSaveProfile}
                    disabled={!displayName || !name}
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                >
                    Create Account
                </Button>
            </Group>
        </Modal>
    );
}
