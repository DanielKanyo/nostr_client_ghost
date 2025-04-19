import { useState } from "react";

import { ComboboxItem, Select } from "@mantine/core";
import { IconSelector } from "@tabler/icons-react";

import { NoteFilterOptions } from "../../../Shared/utils";
import classes from "./filter.module.css";

interface FilterProps {
    filter: string;
    handleFilterChange: (option: NoteFilterOptions) => void;
}

const data: ComboboxItem[] = [
    { value: NoteFilterOptions.Notes, label: "Latest Notes By Your Follows" },
    { value: NoteFilterOptions.All, label: "Latest Notes And Replies By Your Follows" },
];

export default function Filter({ filter, handleFilterChange }: FilterProps) {
    const initialItem = data.find((item) => item.value === filter) || null;
    const [value, setValue] = useState<ComboboxItem | null>(initialItem);

    const handleChange = (item: ComboboxItem) => {
        setValue(item);
        handleFilterChange(item.value as NoteFilterOptions);
    };

    return (
        <Select
            my={0}
            mr="md"
            pl="md"
            variant="unstyled"
            data={data}
            value={value?.value ?? null}
            onChange={(_val, option) => handleChange(option)}
            classNames={classes}
            rightSection={<IconSelector size={18} />}
        />
    );
}
