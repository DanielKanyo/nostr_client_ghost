import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { SimplePool } from "nostr-tools";

import { Alert, Button, Checkbox, Flex, Modal } from "@mantine/core";
import { IconCirclePlus, IconExclamationCircle } from "@tabler/icons-react";

import { authenticateUser, closePool, fetchUserMetadata, generateKeyPair, publishProfile } from "../../Services/authService";
import { HIDE_ALERT_TIMEOUT_IN_MS } from "../../Shared/utils";
import { updateAuthenticated, updateLoading, updateUser } from "../../Store/Features/userSlice";
import { UserMetadata } from "../../Types/userMetadata";
import PrivateKeyInput from "../PrivateKeyInput";
import AccountForm from "./AccountForm";

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
    const [privateKeyStored, setPrivateKeyStored] = useState<boolean>(false);
    const dispatch = useDispatch();

    const { privateKey } = generateKeyPair();

    useEffect(() => {
        if (warning) {
            const timer = setTimeout(() => setWarning(""), HIDE_ALERT_TIMEOUT_IN_MS);
            return () => clearTimeout(timer);
        }
    }, [warning]);

    const handleSaveProfile = async () => {
        if (!displayName || !name) {
            setWarning("Please fill the required fields!");
            return;
        }

        setWarning("");
        setLoading(true);

        const metadataToStore: UserMetadata = { name, display_name: displayName, website, picture, banner, about };
        const pool = new SimplePool();

        try {
            await publishProfile(pool, privateKey, metadataToStore);
            const publicKey = await authenticateUser(privateKey);
            const metadata = await fetchUserMetadata(pool, publicKey);

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
            closePool(pool);
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
        setPrivateKeyStored(false);

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
            <AccountForm
                name={name}
                displayName={displayName}
                picture={picture}
                banner={banner}
                website={website}
                about={about}
                setName={setName}
                setDisplayName={setDisplayName}
                setPicture={setPicture}
                setBanner={setBanner}
                setWebsite={setWebsite}
                setAbout={setAbout}
            />
            <PrivateKeyInput privateKey={privateKey} primaryColor="violet" />
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
            <Flex mt="lg" justify="space-between" align="center">
                <Checkbox
                    label="Private Key Securely Stored"
                    color="violet"
                    checked={privateKeyStored}
                    onChange={() => setPrivateKeyStored(!privateKeyStored)}
                />
                <Button
                    variant="filled"
                    radius="xl"
                    color="violet"
                    onClick={handleSaveProfile}
                    disabled={!displayName || !name || !privateKeyStored}
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                    leftSection={<IconCirclePlus size={21} />}
                >
                    Create Account
                </Button>
            </Flex>
        </Modal>
    );
}
