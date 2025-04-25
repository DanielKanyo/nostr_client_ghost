import { useEffect, useState, useMemo } from "react";

import { SimplePool } from "nostr-tools";

import { Center, Loader } from "@mantine/core";
import { IconUserOff } from "@tabler/icons-react";

import Empty from "../../Components/Empty";
import PageTitle from "../../Components/PageTitle";
import UserItem from "../../Components/UserItem";
import Content from "../../Layouts/Content";
import MainContainer from "../../Layouts/MainContainer";
import ScrollContainer from "../../Layouts/ScrollContainer";
import SideContainer from "../../Layouts/SideContainer";
import { closePool, fetchMultipleUserMetadata } from "../../Services/userService";
import { DEFAULT_MAIN_CONTAINER_WIDTH, DEFAULT_SIDE_CONTAINER_WIDTH } from "../../Shared/utils";
import { useAppSelector } from "../../Store/hook";
import { UserMetadata } from "../../Types/userMetadata";

export default function MutedAccounts() {
    const mutedAccounts = useAppSelector((state) => state.mutedAccounts);
    const [loading, setLoading] = useState(false);
    const [usersMetadata, setUsersMetadata] = useState<Map<string, UserMetadata>>(new Map());

    useEffect(() => {
        if (mutedAccounts.length === 0) {
            setUsersMetadata(new Map());
            return;
        }

        const loadUsersMetadata = async () => {
            setLoading(true);
            const pool = new SimplePool();

            try {
                const metadata = await fetchMultipleUserMetadata(pool, mutedAccounts);
                setUsersMetadata(metadata);
            } catch (error) {
                // TODO: Error handling
                console.error("Failed to fetch muted user metadata:", error);
            } finally {
                closePool(pool);
                setLoading(false);
            }
        };

        loadUsersMetadata();
    }, [mutedAccounts]);

    const renderedUsers = useMemo(() => {
        return mutedAccounts
            .map((pubkey) => usersMetadata.get(pubkey))
            .filter(Boolean)
            .map((user) => (
                <UserItem
                    key={user!.pubkey}
                    displayName={user!.display_name}
                    picture={user!.picture}
                    name={user!.name}
                    pubkey={user!.pubkey}
                    withMuteAndUnmuteControl
                />
            ));
    }, [mutedAccounts, usersMetadata]);

    return (
        <Content>
            <MainContainer width={DEFAULT_MAIN_CONTAINER_WIDTH}>
                <PageTitle title="Muted Accounts" withBackBtn />
                <ScrollContainer>
                    {loading ? (
                        <Center>
                            <Loader size={36} my="md" color="var(--mantine-color-dark-0)" type="dots" />
                        </Center>
                    ) : renderedUsers.length === 0 ? (
                        <Empty icon={<IconUserOff size={30} />} text="No muted accounts..." />
                    ) : (
                        renderedUsers
                    )}
                </ScrollContainer>
            </MainContainer>
            <SideContainer width={DEFAULT_SIDE_CONTAINER_WIDTH}>Side Box</SideContainer>
        </Content>
    );
}
