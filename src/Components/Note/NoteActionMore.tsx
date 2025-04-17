import { Menu, ActionIcon } from "@mantine/core";
import { IconDots, IconLink, IconBlockquote, IconGridGoldenratio, IconKey, IconUserCancel } from "@tabler/icons-react";

export default function NoteActionMore() {
    return (
        <Menu shadow="lg" position="bottom-end" radius="md">
            <Menu.Target>
                <ActionIcon aria-label="dots" variant="subtle" size={28} color="gray" radius="xl" onClick={(e) => e.stopPropagation()}>
                    <IconDots size={18} color="gray" />
                </ActionIcon>
            </Menu.Target>

            {/* TODO */}
            <Menu.Dropdown>
                <Menu.Label fz="sm">Note</Menu.Label>
                <Menu.Item fz="md" leftSection={<IconLink size={18} />}>
                    Copy Note Link
                </Menu.Item>
                <Menu.Item fz="md" leftSection={<IconBlockquote size={18} />}>
                    Copy Note Text
                </Menu.Item>
                <Menu.Item fz="md" leftSection={<IconGridGoldenratio size={18} />}>
                    Copy Note Id
                </Menu.Item>
                <Menu.Label fz="sm">User</Menu.Label>
                <Menu.Item fz="md" leftSection={<IconKey size={18} />}>
                    Copy User Public Key
                </Menu.Item>
                <Menu.Item fz="md" leftSection={<IconUserCancel size={18} />} color="red">
                    Mute User
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
