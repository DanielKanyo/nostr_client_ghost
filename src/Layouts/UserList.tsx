import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { Button, Center, Container, Loader } from "@mantine/core";
import { IconDots, IconUserOff } from "@tabler/icons-react";

import Empty from "../Components/Empty";
import UserItem from "../Components/UserItem";
import { addSelectedUserFollowingProfile, removeSelectedUserFollowingProfile } from "../Store/Features/selectedUserSlice";
import { UserMetadata } from "../Types/userMetadata";

interface UserListProps {
    profiles: UserMetadata[];
    loading: boolean;
    loadUsers: () => void;
    pubkeys: string[];
}

export default function UserList({ profiles, loading, loadUsers, pubkeys }: UserListProps) {
    const dispatch = useDispatch();

    const handleFollowUser = useCallback(
        (pubkey: string) => {
            const profileToAdd = profiles.find((p) => p.pubkey === pubkey);

            if (profileToAdd) {
                dispatch(addSelectedUserFollowingProfile(profileToAdd));
            }
        },
        [profiles]
    );

    const handleUnfollowUser = useCallback((pubkey: string) => {
        dispatch(removeSelectedUserFollowingProfile(pubkey));
    }, []);

    if (!pubkeys.length) return <Empty icon={<IconUserOff size={30} />} text="Nothing to display..." />;

    return (
        <>
            {profiles.map((p) => (
                <UserItem
                    key={p.pubkey}
                    pubkey={p.pubkey}
                    name={p.name}
                    displayName={p.display_name}
                    picture={p.picture}
                    handleFollowUser={handleFollowUser}
                    handleUnfollowUser={handleUnfollowUser}
                />
            ))}
            {loading && (
                <Center>
                    <Loader size={36} my="md" color="var(--mantine-color-dark-0)" type="dots" />
                </Center>
            )}
            {profiles.length < pubkeys.length && !loading && (
                <Container m="md" p={0}>
                    <Button
                        variant="subtle"
                        color="gray"
                        radius="md"
                        onClick={() => loadUsers()}
                        loading={loading}
                        loaderProps={{ type: "dots" }}
                        fullWidth
                    >
                        <IconDots />
                    </Button>
                </Container>
            )}
        </>
    );
}
