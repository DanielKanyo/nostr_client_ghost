import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import { IconCircleDot, IconCircleDotFilled, IconCircleFilled, IconFilter } from "@tabler/icons-react";

import { NoteFilterOptions } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";

interface FilterProps {
    filter: string;
    handleFilterChange: (option: NoteFilterOptions) => void;
}

export default function Filter({ filter, handleFilterChange }: FilterProps) {
    const { color } = useAppSelector((state) => state.primaryColor);

    return (
        <Menu shadow="lg" position="bottom-end" radius="md" width={250}>
            <Menu.Target>
                <Tooltip label="Filter Options" withArrow position="left">
                    <ActionIcon variant="subtle" color="gray" radius="xl" aria-label="filter-options" size={32}>
                        <IconFilter size={18} />
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label fz="sm">Filter Options</Menu.Label>
                <Menu.Item
                    fz="md"
                    leftSection={<IconCircleFilled size={18} />}
                    onClick={() => handleFilterChange(NoteFilterOptions.All)}
                    color={filter === NoteFilterOptions.All ? color : "gray"}
                >
                    All
                </Menu.Item>
                <Menu.Item
                    fz="md"
                    leftSection={<IconCircleDotFilled size={18} />}
                    onClick={() => handleFilterChange(NoteFilterOptions.Notes)}
                    color={filter === NoteFilterOptions.Notes ? color : "gray"}
                >
                    Only Notes
                </Menu.Item>
                <Menu.Item
                    fz="md"
                    leftSection={<IconCircleDot size={18} />}
                    onClick={() => handleFilterChange(NoteFilterOptions.Replies)}
                    color={filter === NoteFilterOptions.Replies ? color : "gray"}
                >
                    Only Replies
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
