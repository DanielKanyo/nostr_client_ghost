import { MantineColor, Tabs } from "@mantine/core";

import { useAppSelector } from "../../Store/hook";
import classes from "./tabs.module.css";

export default function ProfileContent() {
    const primaryColor = useAppSelector((state) => state.primaryColor) as MantineColor;

    return (
        <Tabs radius="lg" defaultValue="notes" color={primaryColor} classNames={classes} mt="lg">
            <Tabs.List grow>
                <Tabs.Tab value="notes">Notes</Tabs.Tab>
                <Tabs.Tab value="reads">Reads</Tabs.Tab>
                <Tabs.Tab value="replies">Replies</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="notes" p="lg">
                TODO: Notes
            </Tabs.Panel>

            <Tabs.Panel value="reads" p="lg">
                TODO: Reads
            </Tabs.Panel>

            <Tabs.Panel value="replies" p="lg">
                TODO: Replies
            </Tabs.Panel>
        </Tabs>
    );
}
