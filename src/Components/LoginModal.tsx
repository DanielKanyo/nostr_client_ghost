import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";

import { SimplePool } from "nostr-tools";

import { Alert, Button, CloseButton, Flex, Input, Modal } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

import { authenticate, fetchUserMetadata } from "../Services/service";
import { updateAuthenticated, updateLoading, updateUser } from "../Store/Features/userSlice";

interface LoginModalProps {
    opened: boolean;
    close: () => void;
}

export default function LoginModal({ opened, close }: LoginModalProps) {
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
            const publicKey = await authenticate(privateKey, pool);
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

    return (
        <Modal opened={opened} onClose={close} title="Login" centered overlayProps={{ blur: 3 }} padding="lg" radius="md">
            <Flex direction="column">
                <Input
                    variant="filled"
                    size="md"
                    radius="md"
                    placeholder="Nostr private key starting with 'nsec'..."
                    value={privateKey}
                    onChange={(event) => setPrivateKey(event.currentTarget.value.trim())}
                    rightSectionPointerEvents="all"
                    rightSection={
                        <CloseButton
                            aria-label="Clear input"
                            onClick={() => setPrivateKey("")}
                            style={{ display: privateKey ? undefined : "none" }}
                        />
                    }
                    autoFocus
                    aria-label="Nostr private key input"
                    mb="lg"
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
