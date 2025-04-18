import { useEffect, useState } from "react";

import { NostrEvent, SimplePool } from "nostr-tools";

import { MantineColor, Tabs } from "@mantine/core";

import { fetchNotes } from "../../Services/noteService";
import { closePool, fetchMultipleUserMetadata } from "../../Services/userService";
import classes from "../../Shared/Styles/tabs.module.css";
import { DEFAULT_NUM_OF_DISPLAYED_NOTES, NoteFilterOptions, PROFILE_CONTENT_TABS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";
import Notes from "../Notes";
import UserList from "../UserList";

interface ProfileContentProps {
    pubkey: string;
    activeTab: string | null;
    filterOption: NoteFilterOptions;
    handleActiveTabChange: (value: PROFILE_CONTENT_TABS) => void;
    followers: string[];
    following: string[];
}

export default function ProfileContent({
    pubkey,
    activeTab,
    handleActiveTabChange,
    filterOption,
    followers,
    following,
}: ProfileContentProps) {
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;
    const [notes, setNotes] = useState<NostrEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [usersMetadata, setUsersMetadata] = useState<UserMetadata[]>([]);
    const [until, setUntil] = useState<number | undefined>(undefined);
    const limit = DEFAULT_NUM_OF_DISPLAYED_NOTES;

    const loadNotes = async (reset: boolean = false) => {
        setLoading(true);

        const pool = new SimplePool();

        try {
            const newNotes = await fetchNotes(pool, [pubkey], limit, filterOption, reset ? undefined : until);

            if (newNotes.length > 0) {
                const metadataMap = await fetchMultipleUserMetadata(pool, [pubkey]);

                setUsersMetadata(Array.from(metadataMap.values()));
                setNotes((prev) => (reset ? newNotes : [...prev, ...newNotes]));

                setUntil(newNotes[newNotes.length - 1].created_at - 1);
            }
        } catch (error) {
            console.error("Error loading notes:", error);
        } finally {
            closePool(pool);
            setLoading(false);
        }
    };

    useEffect(() => {
        setNotes([]);
        setUntil(undefined);
        loadNotes(true);
    }, [pubkey, filterOption]);

    return (
        <Tabs
            radius="md"
            defaultValue={PROFILE_CONTENT_TABS.NOTES}
            color={primaryColor}
            classNames={classes}
            mt="lg"
            value={activeTab}
            onChange={(e) => handleActiveTabChange(e as PROFILE_CONTENT_TABS)}
            keepMounted={false}
        >
            <Tabs.List grow>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.NOTES}>Notes</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.READS}>Reads</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.REPLIES}>Replies</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWERS}>Followers</Tabs.Tab>
                <Tabs.Tab value={PROFILE_CONTENT_TABS.FOLLOWING}>Following</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="notes">
                <Notes notes={notes} usersMetadata={usersMetadata} loading={loading} loadNotes={loadNotes} />
            </Tabs.Panel>

            <Tabs.Panel value="reads" p="md">
                TODO: Reads
            </Tabs.Panel>

            <Tabs.Panel value="replies">
                <Notes notes={notes} usersMetadata={usersMetadata} loading={loading} loadNotes={loadNotes} />
            </Tabs.Panel>

            <Tabs.Panel value="followers">
                <UserList pubkeys={followers} />
            </Tabs.Panel>

            <Tabs.Panel value="following">
                <UserList pubkeys={following} />
            </Tabs.Panel>
        </Tabs>
    );
}
