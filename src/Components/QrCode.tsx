import { useEffect, useRef } from "react";

import QRCodeStyling from "qr-code-styling";

import { Paper, useMantineTheme } from "@mantine/core";

interface QRCode {
    publicKey: string;
    size: number;
}

export default function QRCode({ publicKey, size }: QRCode) {
    const ref = useRef<HTMLDivElement | null>(null);
    const theme = useMantineTheme();

    const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: "canvas",
        data: publicKey,
        dotsOptions: {
            color: theme.colors.dark[6],
            type: "rounded",
        },
        cornersSquareOptions: {
            type: "extra-rounded",
        },
    });

    useEffect(() => {
        if (ref.current) {
            qrCode.append(ref.current);
        }
    }, []);

    return (
        <Paper shadow="xs" radius="lg" p="sm" bg="white">
            <div style={{ height: size, width: size }} ref={ref} />
        </Paper>
    );
}
