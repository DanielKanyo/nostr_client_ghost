import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";

import { SimplePool } from "nostr-tools";

import { Alert, Button, Flex, Modal, PasswordInput } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

import { authenticateUser, fetchUserMetadata } from "../Services/authService";
import { updateAuthenticated, updateLoading, updateUser } from "../Store/Features/userSlice";

interface SignInModalProps {
    opened: boolean;
    close: () => void;
}

export default function SignInModal({ opened, close }: SignInModalProps) {
    const [privateKey, setPrivateKey] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
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
            localStorage.removeItem("nostrPrivateKey");
            localStorage.removeItem("nostrPublicKey");

            setError(err instanceof Error ? err.message : "Authentication failed...");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPrivateKey("");
        setError("");

        close();
    };

    return (
        <Modal opened={opened} onClose={handleClose} title="Login" centered overlayProps={{ blur: 3 }} padding="lg" radius="md" size="lg">
            <Flex direction="column">
                <PasswordInput
                    variant="filled"
                    size="md"
                    radius="md"
                    label="Enter your private key"
                    description='It starts with "nsec"'
                    placeholder="nsec..."
                    value={privateKey}
                    onChange={(event) => setPrivateKey(event.currentTarget.value.trim())}
                    autoFocus
                    aria-label="Nostr private key input"
                    mb="lg"
                    data-autofocus
                />

                {error && (
                    <Alert variant="light" color="red" radius="md" title="Something went wrong!" icon={<IconExclamationCircle />} mb="lg">
                        {error}
                    </Alert>
                )}

                <Button variant="filled" radius="md" color="violet" onClick={handleLogin} loading={loading} loaderProps={{ type: "dots" }}>
                    Login
                </Button>
            </Flex>
        </Modal>
    );
}
