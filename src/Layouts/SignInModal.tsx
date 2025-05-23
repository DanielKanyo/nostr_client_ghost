import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { SimplePool } from "nostr-tools";

import { ActionIcon, Alert, Button, Flex, Group, Modal, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconExclamationCircle, IconEye, IconEyeClosed, IconLogin2, IconX } from "@tabler/icons-react";

import { authenticateUser, closePool, fetchUserMetadata, getFollowers, getFollowing } from "../Services/userService";
import containedInputClasses from "../Shared/Styles/containedInput.module.css";
import { HIDE_ALERT_TIMEOUT_IN_MS } from "../Shared/utils";
import { updateUser } from "../Store/Features/userSlice";

interface SignInModalProps {
    opened: boolean;
    close: () => void;
}

export default function SignInModal({ opened, close }: SignInModalProps) {
    const [privateKey, setPrivateKey] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [visible, { toggle }] = useDisclosure(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), HIDE_ALERT_TIMEOUT_IN_MS);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const pool = new SimplePool();

        try {
            const publicKey = await authenticateUser(privateKey);
            const metadata = await fetchUserMetadata(pool, publicKey);
            const [following, followers] = await Promise.all([getFollowing(pool, publicKey), getFollowers(pool, publicKey)]);

            localStorage.setItem("nostrPrivateKey", privateKey);
            localStorage.setItem("nostrPublicKey", publicKey);

            dispatch(
                updateUser({
                    profile: metadata,
                    privateKey,
                    publicKey,
                    followers,
                    following,
                    authenticated: true,
                    loading: false,
                })
            );
        } catch (err) {
            localStorage.removeItem("nostrPrivateKey");
            localStorage.removeItem("nostrPublicKey");

            setError(err instanceof Error ? err.message : "Authentication failed...");
        } finally {
            closePool(pool);
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPrivateKey("");
        setError("");

        close();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Login"
            centered
            overlayProps={{ blur: 3 }}
            padding="lg"
            radius="lg"
            size="lg"
            closeButtonProps={{
                icon: <IconX size={20} />,
                radius: "xl",
                size: "lg",
            }}
        >
            <Flex direction="column">
                <PasswordInput
                    radius="md"
                    label="Nost private key"
                    placeholder="nsec..."
                    value={privateKey}
                    onChange={(event) => setPrivateKey(event.currentTarget.value.trim())}
                    autoFocus
                    aria-label="Nostr private key input"
                    mb="lg"
                    data-autofocus
                    classNames={containedInputClasses}
                    visible={visible}
                    rightSection={
                        <ActionIcon color="gray" variant="light" radius="md" mr={10} onClick={toggle}>
                            {visible ? <IconEyeClosed size={17} /> : <IconEye size={17} />}
                        </ActionIcon>
                    }
                />

                {error && (
                    <Alert variant="light" color="red" radius="md" title="Something went wrong!" icon={<IconExclamationCircle />} mb="lg">
                        {error}
                    </Alert>
                )}

                <Group justify="flex-end">
                    <Button
                        variant="filled"
                        radius="xl"
                        color="violet"
                        onClick={handleLogin}
                        loading={loading}
                        loaderProps={{ type: "dots" }}
                        disabled={!privateKey}
                        leftSection={<IconLogin2 size={21} />}
                        size="md"
                    >
                        Login
                    </Button>
                </Group>
            </Flex>
        </Modal>
    );
}
