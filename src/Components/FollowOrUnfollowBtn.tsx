import { useState } from "react";

import { SimplePool } from "nostr-tools";

import { Tooltip, ActionIcon } from "@mantine/core";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";

import { updateFollowList, closePool } from "../Services/userService";
import { resetNotes } from "../Store/Features/noteDataSlice";
import { updateScrollPosition } from "../Store/Features/scrollPositionSlice";
import { UserState, updateUserFollowing } from "../Store/Features/userSlice";
import { useAppDispatch } from "../Store/hook";

export default function FollowOrUnfollowBtn({ loggedInUser, pubkey, color }: { loggedInUser: UserState; pubkey: string; color: string }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    if (loggedInUser.publicKey === pubkey) {
        return null;
    }

    const follow = async (e: React.MouseEvent) => {
        e.stopPropagation();

        setLoading(true);

        const pool = new SimplePool();

        try {
            const newFollowing = [...loggedInUser.following, pubkey];

            await updateFollowList(pool, loggedInUser.privateKey!, newFollowing);

            dispatch(resetNotes());
            dispatch(updateScrollPosition(0));
            dispatch(updateUserFollowing(newFollowing));
        } catch (error) {
            console.error("Something went wrong...", error);
        } finally {
            closePool(pool);
            setLoading(false);
        }
    };

    const unfollow = async (e: React.MouseEvent) => {
        e.stopPropagation();

        setLoading(true);

        const pool = new SimplePool();

        try {
            const newFollowing = loggedInUser.following.filter((pk) => pk !== pubkey);

            await updateFollowList(pool, loggedInUser.privateKey!, newFollowing);

            dispatch(updateUserFollowing(newFollowing));
        } catch (error) {
            console.error("Something went wrong...", error);
        } finally {
            closePool(pool);
            setLoading(false);
        }
    };

    return loggedInUser.following.includes(pubkey) ? (
        <Tooltip label="Unfollow User" withArrow>
            <ActionIcon
                aria-label="unfollow"
                variant="filled"
                size="xl"
                radius="xl"
                color="red"
                onClick={(e) => unfollow(e)}
                disabled={loading}
            >
                <IconUserMinus />
            </ActionIcon>
        </Tooltip>
    ) : (
        <Tooltip label="Follow User" withArrow>
            <ActionIcon
                aria-label="follow"
                variant="filled"
                size="xl"
                radius="xl"
                color={color}
                onClick={(e) => follow(e)}
                disabled={loading}
            >
                <IconUserPlus />
            </ActionIcon>
        </Tooltip>
    );
}
