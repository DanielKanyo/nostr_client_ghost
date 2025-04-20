import { useMemo } from "react";

import { NostrEvent } from "nostr-tools";

import { ActionIcon, CopyButton, Menu } from "@mantine/core";
import { IconBlockquote, IconDots, IconKey, IconLink, IconUserCancel } from "@tabler/icons-react";

import { EVENT_ROUTE_BASE } from "../../Routes/routes";
import { encodeNPub } from "../../Services/userService";
import { UserMetadata } from "../../Types/userMetadata";

interface NoteActionMorePorps {
    note: NostrEvent;
    usersMetadata: UserMetadata | undefined;
    nevent: string;
}

export default function NoteActionMore({ note, nevent }: NoteActionMorePorps) {
    const npub = useMemo(() => encodeNPub(note.pubkey), [note.pubkey]);

    return (
        <Menu shadow="lg" position="bottom-end" radius="md" width={250}>
            <Menu.Target>
                <ActionIcon aria-label="dots" variant="subtle" size={32} color="gray" radius="xl" onClick={(e) => e.stopPropagation()}>
                    <IconDots size={18} color="gray" />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label fz="sm">Note</Menu.Label>
                <CopyButton value={`${window.location.origin}${EVENT_ROUTE_BASE}/${nevent}`} timeout={2000}>
                    {({ copy }) => (
                        <Menu.Item fz="md" leftSection={<IconLink size={18} />} onClick={copy}>
                            Copy Note Link
                        </Menu.Item>
                    )}
                </CopyButton>
                <CopyButton value={note.content} timeout={2000}>
                    {({ copy }) => (
                        <Menu.Item fz="md" leftSection={<IconBlockquote size={18} />} onClick={copy}>
                            Copy Note Text
                        </Menu.Item>
                    )}
                </CopyButton>
                <CopyButton value={nevent} timeout={2000}>
                    {({ copy }) => (
                        <Menu.Item fz="md" leftSection={<IconLink size={18} />} onClick={copy}>
                            Copy Note Id
                        </Menu.Item>
                    )}
                </CopyButton>
                <Menu.Label fz="sm">User</Menu.Label>
                <CopyButton value={npub} timeout={2000}>
                    {({ copy }) => (
                        <Menu.Item fz="md" leftSection={<IconKey size={18} />} onClick={copy}>
                            Copy User Public Key
                        </Menu.Item>
                    )}
                </CopyButton>
                {/* TODO */}
                <Menu.Item fz="md" leftSection={<IconUserCancel size={18} />} color="red">
                    Mute User
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
