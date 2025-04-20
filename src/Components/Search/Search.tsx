import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Avatar, Box, Center, Combobox, CSSProperties, Flex, Group, InputBase, Loader, Text, useCombobox } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { PROFILE_ROUTE_BASE } from "../../Routes/routes";
import { closePool, decodeNPub, encodeNProfile, encodeNPub, fetchUserMetadata } from "../../Services/userService";
import inputClasses from "../../Shared/Styles/inputFocus.module.css";
import { isHexPubkey } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";
import seachClasses from "./search.module.css";

export default function Search() {
    const { borderColor } = useAppSelector((state) => state.primaryColor);
    const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [optionsData, setOptionsData] = useState<UserMetadata[]>([]);
    const navigate = useNavigate();

    const fetchSearchResults = async (input: string) => {
        if (!input) return;

        let pubkey: string | null = null;

        try {
            const { type, data } = decodeNPub(input.trim());

            if (type === "npub") {
                pubkey = data as string;
            } else if (type === "nprofile") {
                pubkey = (data as any).pubkey;
            } else {
                // Unsupported type
                setOptionsData([]);
                combobox.closeDropdown();
                return;
            }
        } catch (e) {
            if (isHexPubkey(input.trim())) {
                pubkey = input.trim();
            } else {
                console.error("Invalid identifier:", e);
                setOptionsData([]);
                combobox.closeDropdown();
                return;
            }
        }

        setLoading(true);
        combobox.openDropdown();

        const pool = new SimplePool();

        try {
            const metadata = await fetchUserMetadata(pool, pubkey!);

            if (metadata) {
                setOptionsData([metadata]);
            }
        } catch (error) {
            console.error("Search error:", error);
            setOptionsData([]);
            combobox.closeDropdown();
        } finally {
            closePool(pool);
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSearchResults(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleContainerClick = (pubkey: string) => {
        navigate(`${PROFILE_ROUTE_BASE}/${encodeNProfile(pubkey)}`);
    };

    const options = optionsData.map((p) => (
        <Group key={p.pubkey} onClick={() => handleContainerClick(p.pubkey)} mx="sm" style={{ cursor: "pointer" }}>
            <Avatar src={p.picture} radius={44} size={44} />
            <Flex direction="column" align="flex-start" justify="center">
                <Box w={160}>
                    <Text ta="left" size="sm" truncate="end">
                        {p.display_name}
                    </Text>
                    <Text ta="left" c="dimmed" size="xs" truncate="end">
                        {p.name ? `@${p.name}` : encodeNPub(p.pubkey)}
                    </Text>
                </Box>
            </Flex>
        </Group>
    ));

    return (
        <Box p="md">
            <Combobox store={combobox} withinPortal={false}>
                <Combobox.Target>
                    <InputBase
                        radius="xl"
                        size="md"
                        rightSection={null}
                        leftSection={<IconSearch size={18} />}
                        value={search}
                        onChange={(event) => {
                            const newValue = event.currentTarget.value;
                            setSearch(newValue);
                            combobox.updateSelectedOptionIndex();
                        }}
                        onBlur={() => {
                            combobox.closeDropdown();
                            setOptionsData([]);
                            setSearch("");
                        }}
                        placeholder="Search public key..."
                        classNames={inputClasses}
                        style={{ "--input-border-color-focus": borderColor } as CSSProperties}
                    />
                </Combobox.Target>

                <Combobox.Dropdown classNames={seachClasses}>
                    <Combobox.Options>
                        {loading && (
                            <Center w={288}>
                                <Loader size={36} color="var(--mantine-color-dark-0)" type="dots" my={4} />
                            </Center>
                        )}
                        {options.length > 0 && options}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
        </Box>
    );
}
