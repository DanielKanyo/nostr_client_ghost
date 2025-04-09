import { useState } from "react";
import { useDispatch } from "react-redux";

import { SimplePool } from "nostr-tools";

import { Alert, Button, Group, Modal, Textarea, TextInput } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

import { authenticateUser, fetchUserMetadata, generateKeyPair, publishProfile } from "../Services/authService";
import { updateAuthenticated, updateLoading, updateUser } from "../Store/Features/userSlice";
import { UserMetadata } from "../Types/userMetadata";

interface SignUpModalProps {
    opened: boolean;
    close: () => void;
}

export default function SignUpModal({ opened, close }: SignUpModalProps) {
    const [name, setName] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [website, setWebsite] = useState<string>("");
    const [picture, setPicture] = useState<string>("");
    const [banner, setBanner] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [warning, setWarning] = useState<string>("");
    const dispatch = useDispatch();

    const handleSaveProfile = async () => {
        if (!displayName || !name) {
            setWarning("Please fill the required fields!");
            return;
        }

        setWarning("");
        setLoading(true);

        const { privateKey } = generateKeyPair();
        const metadataToStore: UserMetadata = { name, display_name: displayName, website, picture, banner, about };

        try {
            await publishProfile(privateKey, metadataToStore);

            const pool = new SimplePool();
            const publicKey = await authenticateUser(privateKey, pool);
            const metadata = await fetchUserMetadata(publicKey, pool);

            localStorage.setItem("nostrPrivateKey", privateKey);
            localStorage.setItem("nostrPublicKey", publicKey);

            if (metadata) {
                dispatch(updateUser(metadata));
            }

            dispatch(updateAuthenticated(true));
            dispatch(updateLoading(false));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Profile creation failed...");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName("");
        setDisplayName("");
        setAbout("");
        setPicture("");
        setBanner("");
        setWebsite("");
        setWarning("");
        setError("");

        close();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Create Your Nostr Account"
            centered
            overlayProps={{ blur: 3 }}
            padding="lg"
            radius="md"
            size="lg"
        >
            <Group mt="lg" grow gap="lg">
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Name"
                    description="Pick a short name"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter your name"
                    withAsterisk
                    data-autofocus
                />
                <TextInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Display Name"
                    description="Pick a longer display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    placeholder="Enter your display name"
                    withAsterisk
                />
            </Group>
            <TextInput
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                label="Profile Picture Url"
                value={picture}
                onChange={(e) => setPicture(e.currentTarget.value)}
                placeholder="Enter the url to your profile picture"
            />
            <TextInput
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                label="Banner Picture Url"
                value={banner}
                onChange={(e) => setBanner(e.currentTarget.value)}
                placeholder="Enter the url to your banner picture"
            />
            <TextInput
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.currentTarget.value)}
                placeholder="https://yourwebsite.com"
            />
            <Textarea
                label="About Me"
                placeholder="Say some words about yourself"
                variant="filled"
                size="md"
                radius="md"
                mt="lg"
                value={about}
                onChange={(e) => setAbout(e.currentTarget.value)}
                autosize
                minRows={3}
            />
            {error && (
                <Alert variant="light" color="red" radius="md" title="Something went wrong!" icon={<IconExclamationCircle />} mt="lg">
                    {error}
                </Alert>
            )}
            {warning && (
                <Alert variant="light" color="orange" radius="md" title="Warning!" icon={<IconExclamationCircle />} mt="lg">
                    {warning}
                </Alert>
            )}
            <Group mt="lg" justify="flex-end" gap="xs">
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
