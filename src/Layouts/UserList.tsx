import { Button, Center, Container, Loader } from "@mantine/core";
import { IconDots, IconUserOff } from "@tabler/icons-react";

import Empty from "../Components/Empty";
import UserItem from "../Components/UserItem";
import { UserMetadata } from "../Types/userMetadata";

interface UserListProps {
    profiles: UserMetadata[];
    loading: boolean;
    loadUsers: () => void;
    pubkeys: string[];
}

export default function UserList({ profiles, loading, loadUsers, pubkeys }: UserListProps) {
    if (!pubkeys.length) return <Empty icon={<IconUserOff size={30} />} text="Nothing to display..." />;

    return (
        <>
            {profiles.map((p) => (
                <UserItem key={p.pubkey} pubkey={p.pubkey} name={p.name} displayName={p.display_name} picture={p.picture} />
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
