import { useEffect, useMemo, useState } from "react";

import { Accordion, Box, Center, Group, Indicator, Loader, Stack, Text } from "@mantine/core";
import { IconAccessPoint } from "@tabler/icons-react";

import { checkRelaysStatus, RELAY_STATUSES, RelayStatus } from "../Services/relayService";
import { RELAYS } from "../Shared/utils";
import { useAppSelector } from "../Store/hook";

interface RelayStatusIndicatorProps {
    showList?: boolean;
}

export default function RelayStatusIndicator({ showList }: RelayStatusIndicatorProps) {
    const [statusMap, setStatusMap] = useState<Map<string, RelayStatus> | null>(null);
    const [overallStatus, setOverallStatus] = useState<RELAY_STATUSES>(RELAY_STATUSES.UNKNOWN);
    const [loading, setLoading] = useState<boolean>(false);
    const relays = useAppSelector((state) => state.relays);

    const fetchStatus = async () => {
        setLoading(true);

        try {
            const newStatusMap = await checkRelaysStatus(relays);
            let onlineCount = 0;

            newStatusMap.forEach((value) => {
                if (value === RELAY_STATUSES.ONLINE) {
                    ++onlineCount;
                }
            });

            if (onlineCount === newStatusMap.size) {
                setOverallStatus(RELAY_STATUSES.ONLINE);
            } else if (onlineCount > 0) {
                setOverallStatus(RELAY_STATUSES.WARNING);
            } else {
                setOverallStatus(RELAY_STATUSES.OFFLINE);
            }

            setStatusMap(newStatusMap);
        } catch (error) {
            const fallbackMap = new Map<string, RelayStatus>();

            RELAYS.forEach((relay) => fallbackMap.set(relay, RELAY_STATUSES.OFFLINE));

            setStatusMap(fallbackMap);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();

        const intervalId = setInterval(fetchStatus, 60 * 1000); // 1 minutes in milliseconds

        return () => clearInterval(intervalId);
    }, [relays]);

    const determineRelayStatus = (status: RELAY_STATUSES) => {
        switch (status) {
            case RELAY_STATUSES.ONLINE:
                return "teal";
            case RELAY_STATUSES.WARNING:
                return "yellow";
            case RELAY_STATUSES.OFFLINE:
                return "red";
            default:
                return "gray";
        }
    };

    const indicatorColor = useMemo(() => {
        return determineRelayStatus(overallStatus);
    }, [overallStatus]);

    return (
        <Box py="md" ml="md">
            <Accordion
                variant="filled"
                radius="md"
                disableChevronRotation
                chevron={
                    <Indicator position="middle-center" processing color={indicatorColor}>
                        <Box w={5}></Box>
                    </Indicator>
                }
                defaultValue={showList ? "status" : null}
            >
                <Accordion.Item value="status">
                    <Accordion.Control icon={<IconAccessPoint size={22} />}>Network</Accordion.Control>
                    <Accordion.Panel>
                        {loading && (
                            <Center>
                                <Loader size={36} color="var(--mantine-color-dark-0)" type="dots" />
                            </Center>
                        )}
                        <Stack>
                            {!loading &&
                                statusMap &&
                                [...statusMap.entries()].map(([relay, status]) => (
                                    <Group key={relay} justify="space-between" align="center">
                                        <Box w={230}>
                                            <Text c="dimmed" truncate="end">
                                                {relay}
                                            </Text>
                                        </Box>
                                        <Indicator size={5} position="middle-center" color={determineRelayStatus(status)}>
                                            <Box w={24}></Box>
                                        </Indicator>
                                    </Group>
                                ))}
                        </Stack>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Box>
    );
}
