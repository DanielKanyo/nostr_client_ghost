import { Modal, Image, Card } from "@mantine/core";

type ImageViewerProps = {
    opened: boolean;
    setOpened: (value: boolean) => void;
    fullImageSrc?: string;
    alt?: string;
};

export function ImageViewer({ opened, fullImageSrc, alt, setOpened }: ImageViewerProps) {
    return (
        <Modal opened={opened} onClose={() => setOpened(false)} centered size="auto" withCloseButton radius="lg" overlayProps={{ blur: 3 }}>
            <Card withBorder radius="lg" p={0} style={{ overflow: "hidden" }} shadow="md">
                <Image
                    src={fullImageSrc}
                    alt={alt}
                    fit="contain"
                    style={{
                        maxHeight: "calc(100vh - 200px)",
                        display: "block",
                        margin: "0 auto",
                    }}
                />
            </Card>
        </Modal>
    );
}
