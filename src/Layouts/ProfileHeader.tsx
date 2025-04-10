import { ActionIcon, Avatar, BackgroundImage, Box, Group, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { IconDots, IconMail, IconQrcode, IconUserEdit } from "@tabler/icons-react";

interface ProfileHeaderProps {
    picture: string | undefined;
    banner: string | undefined;
}

export default function ProfileHeader({ banner, picture }: ProfileHeaderProps) {
    const theme = useMantineTheme();
    const computedColorScheme = useComputedColorScheme("light");

    return (
        <Box
            w="100%"
            h={220}
            style={{
                backgroundColor: computedColorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3],
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
            }}
        >
            {banner && (
                <BackgroundImage
                    src={banner}
                    h="100%"
                    pos="relative"
                    style={{
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                    }}
                >
                    <Avatar
                        src={picture}
                        size={160}
                        radius={160}
                        pos="absolute"
                        bottom={-80}
                        left={80}
                        style={{ outline: `10px solid ${computedColorScheme === "dark" ? theme.colors.dark[7] : "white"}` }}
                    />
                </BackgroundImage>
            )}
            <Group justify="flex-end" gap="sm" p="lg">
                <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label="back">
                    <IconDots />
                </ActionIcon>
                <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label="back">
                    <IconQrcode />
                </ActionIcon>
                <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label="back">
                    <IconMail />
                </ActionIcon>
                <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label="back">
                    <IconUserEdit />
                </ActionIcon>
            </Group>
        </Box>
    );
}
