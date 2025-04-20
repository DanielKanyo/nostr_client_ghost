import { useEffect, useState } from "react";

import { ActionIcon, Alert, Button, CopyButton, CSSProperties, Divider, Flex, Group, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconExclamationCircle, IconPlugConnected, IconPlugConnectedX, IconRestore } from "@tabler/icons-react";

import PageTitle from "../../Components/PageTitle";
import RelayStatusIndicator from "../../Components/RelayStatusIndicator";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import ScrollContainer from "../../Layouts/ScrollContainer";
import SideContainer from "../../Layouts/SideContainer";
import containedInputClasses from "../../Shared/Styles/containedInput.module.css";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH, HIDE_ALERT_TIMEOUT_IN_MS } from "../../Shared/utils";
import { removeRelay, resetRelays, updateRelays } from "../../Store/Features/relaysSlice";
import { useAppDispatch, useAppSelector } from "../../Store/hook";

export default function Network() {
    const relays = useAppSelector((state) => state.relays);
    const { color, borderColor } = useAppSelector((state) => state.primaryColor);
    const [relayUrl, setRelayUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [warning, setWarning] = useState<string>("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (error || warning) {
            const timer = setTimeout(() => {
                setWarning("");
                setError("");
            }, HIDE_ALERT_TIMEOUT_IN_MS);
            return () => clearTimeout(timer);
        }
    }, [error, warning]);

    const handleResetRelays = () => {
        dispatch(resetRelays());
    };

    const handleDisconnectFromRelay = (relay: string) => {
        dispatch(removeRelay(relay));
    };

    const handleAddRelay = (relayUrl: string) => {
        setLoading(true);

        try {
            const url = new URL(relayUrl);

            if (url.protocol !== "wss:") {
                throw new Error("Invalid protocol...");
            }

            if (relays.includes(relayUrl)) {
                setWarning("Relay already in the list...");
                return;
            }

            dispatch(updateRelays(relayUrl));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid relay URL...");
        } finally {
            setRelayUrl("");
            setLoading(false);
        }
    };

    useEffect(() => {
        localStorage.setItem("nostrRelays", JSON.stringify(relays));
    }, [relays]);

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Network" withBackBtn />
                <ScrollContainer>
                    <Stack gap="lg" m="lg">
                        <Text size="lg">Connect To Relay</Text>
                        <TextInput
                            radius="md"
                            label="Paste Your Relay URL"
                            classNames={containedInputClasses}
                            value={relayUrl}
                            onChange={(e) => setRelayUrl(e.currentTarget.value)}
                            placeholder="wss://relay.url"
                            size="md"
                            style={{ "--input-border-color-focus": borderColor } as CSSProperties}
                        />
                        {warning && (
                            <Alert variant="light" color="orange" radius="md" title="Warning!" icon={<IconExclamationCircle />}>
                                {warning}
                            </Alert>
                        )}
                        {error && (
                            <Alert variant="light" color="red" radius="md" title="Something went wrong!" icon={<IconExclamationCircle />}>
                                {error}
                            </Alert>
                        )}
                        <Group justify="flex-end">
                            <Button
                                variant="filled"
                                size="md"
                                color={color}
                                radius="xl"
                                leftSection={<IconPlugConnected size={21} />}
                                onClick={() => handleAddRelay(relayUrl)}
                                disabled={!relayUrl}
                                loading={loading}
                                loaderProps={{ type: "dots" }}
                            >
                                Connect
                            </Button>
                        </Group>
                    </Stack>
                    {relays.map((url) => (
                        <div key={url}>
                            <Flex w="100%" justify="space-between" py="xs" px="lg" align="center">
                                <Text>{url}</Text>
                                <Flex gap="xs" align="center">
                                    <CopyButton value={url} timeout={2000}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? "Copied" : "Copy Relay Url"} withArrow>
                                                <ActionIcon
                                                    color={copied ? color : "gray"}
                                                    variant="light"
                                                    size="xl"
                                                    radius="xl"
                                                    onClick={copy}
                                                >
                                                    {copied ? <IconCheck size={22} /> : <IconCopy size={22} />}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                    <Tooltip label="Disconnect From Relay" withArrow>
                                        <ActionIcon
                                            aria-label="disconnect"
                                            variant="light"
                                            color="red"
                                            size="xl"
                                            radius="xl"
                                            onClick={() => handleDisconnectFromRelay(url)}
                                        >
                                            <IconPlugConnectedX />
                                        </ActionIcon>
                                    </Tooltip>
                                </Flex>
                            </Flex>
                            <Divider />
                        </div>
                    ))}
                    <Flex mx={0} px="lg" my="lg" justify="space-between" align="center">
                        <Text>Reset Relays To Defaults</Text>
                        <Tooltip
                            multiline
                            w={300}
                            label="This action will remove your current relay connections and replace them with a recommended set of relays."
                            withArrow
                        >
                            <ActionIcon aria-label="reset" variant="light" color={color} size="xl" radius="xl" onClick={handleResetRelays}>
                                <IconRestore />
                            </ActionIcon>
                        </Tooltip>
                    </Flex>
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>
                <RelayStatusIndicator showList />
            </SideContainer>
        </Content>
    );
}
