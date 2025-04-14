import { MantineColor, Tabs } from "@mantine/core";

import { useAppSelector } from "../../Store/hook";
import Followers from "./Followers";
import classes from "./tabs.module.css";

interface ProfileContentProps {
    activeTab: string | null;
    setActiveTab: (value: string | null) => void;
    followers: string[];
}

export default function ProfileContent({ activeTab, setActiveTab, followers }: ProfileContentProps) {
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;

    return (
        <Tabs radius="lg" defaultValue="notes" color={primaryColor} classNames={classes} mt="lg" value={activeTab} onChange={setActiveTab}>
            <Tabs.List grow>
                <Tabs.Tab value="notes">Notes</Tabs.Tab>
                <Tabs.Tab value="reads">Reads</Tabs.Tab>
                <Tabs.Tab value="replies">Replies</Tabs.Tab>
                <Tabs.Tab value="followers">Followers</Tabs.Tab>
                <Tabs.Tab value="following">Following</Tabs.Tab>
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

            <Tabs.Panel value="followers" p="md">
                <Followers followers={followers} />
            </Tabs.Panel>

            <Tabs.Panel value="following" p="md">
                TODO: Following
            </Tabs.Panel>
        </Tabs>
    );
}
