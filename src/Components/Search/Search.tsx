import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { Avatar, Box, Center, Combobox, CSSProperties, Flex, Group, Input, InputBase, Loader, Text, useCombobox } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { PROFILE_ROUTE_BASE } from "../../Routes/routes";
import { closePool, decodeNPub, encodeNProfile, encodeNPub, fetchUserMetadata } from "../../Services/userService";
import inputClasses from "../../Shared/Styles/inputFocus.module.css";
import { isHexPubkey } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";
import seachClasses from "./search.module.css";

const INVALID_KEY_TEXT = "Invalid key! Make sure you're using a valid npub, nprofile or hexadecimal key...";

export default function Search() {
    const { borderColor } = useAppSelector((state) => state.primaryColor);
    const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [optionsData, setOptionsData] = useState<UserMetadata[]>([]);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const fetchSearchResults = useCallback(
        async (input: string) => {
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
                    setError(INVALID_KEY_TEXT);
                    setOptionsData([]);
                    combobox.closeDropdown();
                    return;
                }
            } catch (e) {
                if (isHexPubkey(input.trim())) {
                    pubkey = input.trim();
                } else {
                    setError(INVALID_KEY_TEXT);
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
                setOptionsData([]);
                combobox.closeDropdown();
            } finally {
                closePool(pool);
                setLoading(false);
            }
        },
        [combobox]
    );

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
        <Box py="md" ml="md">
            <Combobox store={combobox} withinPortal={false} withArrow>
                <Combobox.Target>
                    <Input.Wrapper error={error} classNames={seachClasses}>
                        <InputBase
                            radius="xl"
                            size="md"
                            rightSection={null}
                            leftSection={<IconSearch size={18} />}
                            value={search}
                            onChange={(event) => {
                                setError("");
                                setOptionsData([]);
                                setSearch(event.currentTarget.value);
                                combobox.updateSelectedOptionIndex();
                            }}
                            onBlur={() => {
                                combobox.closeDropdown();
                                setOptionsData([]);
                                setError("");
                                setSearch("");
                            }}
                            placeholder="Search public key..."
                            classNames={inputClasses}
                            style={{ "--input-border-color-focus": borderColor } as CSSProperties}
                            error={!!error}
                        />
                    </Input.Wrapper>
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
