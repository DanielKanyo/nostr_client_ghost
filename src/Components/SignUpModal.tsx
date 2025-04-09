import { Modal } from "@mantine/core";

interface SignUpModalProps {
    opened: boolean;
    close: () => void;
}

export default function SignUpModal({ opened, close }: SignUpModalProps) {
    return (
        <Modal opened={opened} onClose={close} title="Create Account" centered overlayProps={{ blur: 3 }} padding="lg" radius="md">
            Sign Up Modal
        </Modal>
    );
}
