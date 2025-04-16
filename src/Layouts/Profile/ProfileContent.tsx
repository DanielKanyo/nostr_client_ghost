import { MantineColor, Tabs } from "@mantine/core";

import classes from "../../Shared/Styles/tabs.module.css";
import { NoteFilterOptions, PROFILE_CONTENT_TABS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import Notes from "../Notes";
import UserList from "../UserList";

interface ProfileContentProps {
    pubkey: string;
    activeTab: string | null;
    setActiveTab: (value: string | null) => void;
    followers: string[];
    following: string[];
}

export default function ProfileContent({ pubkey, activeTab, setActiveTab, followers, following }: ProfileContentProps) {
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;

    return (
        <Tabs
            radius="md"
            defaultValue={PROFILE_CONTENT_TABS.NOTES}
            color={primaryColor}
            classNames={classes}
            mt="lg"
            value={activeTab}
            onChange={setActiveTab}
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
                <Notes pubkeys={[pubkey]} filterOptions={NoteFilterOptions.Posts} />
            </Tabs.Panel>

            <Tabs.Panel value="reads" p="md">
                TODO: Reads
            </Tabs.Panel>

            <Tabs.Panel value="replies">
                <Notes pubkeys={[pubkey]} filterOptions={NoteFilterOptions.Replies} />
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
