import { Flex, Button, NumberFormatter, Text } from "@mantine/core";

interface FollowersAndFollowing {
    followers: string[];
    following: string[];
}

export default function FollowersAndFollowing({ followers, following }: FollowersAndFollowing) {
    const countStyle = { fontSize: 14, fontWeight: 700 };
    const buttonProps = {
        variant: "light" as const,
        color: "gray",
        size: "xs" as const,
        radius: "xl" as const,
    };

    return (
        <Flex gap="xs">
            <Button {...buttonProps}>
                <Text style={countStyle}>
                    <NumberFormatter thousandSeparator value={followers.length} />{" "}
                </Text>
                <Text ml={6} fz={14} c="dimmed">
                    Followers
                </Text>
            </Button>
            <Button {...buttonProps}>
                <Text style={countStyle}>
                    <NumberFormatter thousandSeparator value={following.length} />{" "}
                </Text>
                <Text ml={6} fz={14} c="dimmed">
                    Following
                </Text>
            </Button>
        </Flex>
    );
}
