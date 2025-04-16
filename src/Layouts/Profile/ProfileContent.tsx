import { MantineColor, Tabs } from "@mantine/core";

import classes from "../../Shared/Styles/tabs.module.css";
import { PROFILE_CONTENT_TABS } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import UserList from "./UserList";

interface ProfileContentProps {
    activeTab: string | null;
    setActiveTab: (value: string | null) => void;
    followers: string[];
    following: string[];
}

export default function ProfileContent({ activeTab, setActiveTab, followers, following }: ProfileContentProps) {
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

            <Tabs.Panel value="notes" p="md">
                TODO: Notes
            </Tabs.Panel>

            <Tabs.Panel value="reads" p="md">
                TODO: Reads
            </Tabs.Panel>

            <Tabs.Panel value="replies" p="md">
                TODO: Replies
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
