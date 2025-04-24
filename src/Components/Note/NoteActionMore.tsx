import { useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";

import { NostrEvent } from "nostr-tools";

import { ActionIcon, CopyButton, Menu } from "@mantine/core";
import { IconBlockquote, IconDots, IconKey, IconLink, IconUserOff } from "@tabler/icons-react";

import { EVENT_ROUTE_BASE } from "../../Routes/routes";
import { encodeNPub } from "../../Services/userService";
import { updateMutedAccounts } from "../../Store/Features/mutedAccountsSlice";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";

interface NoteActionMoreProps {
    note: NostrEvent;
    usersMetadata?: UserMetadata;
    nevent: string;
}

const CopyItem = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
    <CopyButton value={value} timeout={2000}>
        {({ copy }) => (
            <Menu.Item fz="md" leftSection={icon} onClick={copy}>
                {label}
            </Menu.Item>
        )}
    </CopyButton>
);

export default function NoteActionMore({ note, nevent }: NoteActionMoreProps) {
    const dispatch = useDispatch();
    const npub = useMemo(() => encodeNPub(note.pubkey), [note.pubkey]);
    const { publicKey } = useAppSelector((state) => state.user);
    const mutedAccounts = useAppSelector((state) => state.mutedAccounts);

    const isOwnNote = publicKey === note.pubkey;
    const isMuted = useMemo(() => mutedAccounts.includes(note.pubkey), [mutedAccounts, note.pubkey]);

    const updateLocalStorage = (updated: string[]) => {
        localStorage.setItem("nostrMutedAccounts", JSON.stringify(updated));
    };

    const handleMuteToggle = useCallback(() => {
        let updated: string[];

        if (isMuted) {
            updated = mutedAccounts.filter((pk) => pk !== note.pubkey);
        } else {
            updated = [...mutedAccounts, note.pubkey];
        }

        dispatch(updateMutedAccounts(updated));
        updateLocalStorage(updated);
    }, [isMuted, mutedAccounts, note.pubkey, dispatch]);

    return (
        <Menu shadow="lg" position="bottom-end" radius="md" width={250} withArrow>
            <Menu.Target>
                <ActionIcon aria-label="dots" variant="subtle" size={32} color="gray" radius="xl" onClick={(e) => e.stopPropagation()}>
                    <IconDots size={18} color="gray" />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label fz="sm">Note</Menu.Label>
                <CopyItem
                    value={`${window.location.origin}${EVENT_ROUTE_BASE}/${nevent}`}
                    label="Copy Note Link"
                    icon={<IconLink size={18} />}
                />
                <CopyItem value={note.content} label="Copy Note Text" icon={<IconBlockquote size={18} />} />
                <CopyItem value={nevent} label="Copy Note Id" icon={<IconLink size={18} />} />

                <Menu.Label fz="sm">User</Menu.Label>
                <CopyItem value={npub} label="Copy User Public Key" icon={<IconKey size={18} />} />

                {!isOwnNote && (
                    <Menu.Item fz="md" leftSection={<IconUserOff size={18} />} color="red" onClick={handleMuteToggle}>
                        {isMuted ? "Unmute User" : "Mute User"}
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
