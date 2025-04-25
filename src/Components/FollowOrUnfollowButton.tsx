import { useState } from "react";

import { SimplePool } from "nostr-tools";

import { Tooltip, ActionIcon } from "@mantine/core";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";

import { ROUTES } from "../Routes/routes";
import { updateFollowList, closePool } from "../Services/userService";
import { resetNotes } from "../Store/Features/noteDataSlice";
import { updateScrollPosition } from "../Store/Features/scrollPositionSlice";
import { addSelectedUserFollowingPubkey, removeSelectedUserFollowingPubkey } from "../Store/Features/selectedUserSlice";
import { UserState, updateUserFollowing } from "../Store/Features/userSlice";
import { useAppDispatch, useAppSelector } from "../Store/hook";

interface FollowOrUnfollowButtonProps {
    loggedInUser: UserState;
    pubkey: string;
    color: string;
    handleFollowUser?: (value: string) => void;
    handleUnfollowUser?: (value: string) => void;
}

export default function FollowOrUnfollowButton({
    loggedInUser,
    pubkey,
    color,
    handleFollowUser,
    handleUnfollowUser,
}: FollowOrUnfollowButtonProps) {
    const [loading, setLoading] = useState(false);
    const selectedUser = useAppSelector((state) => state.selectedUser);
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
            dispatch(updateScrollPosition({ key: ROUTES.HOME, value: 0 }));
            dispatch(updateUserFollowing(newFollowing));

            if (handleFollowUser && loggedInUser.publicKey === selectedUser.pubkey) {
                handleFollowUser(pubkey);
                dispatch(addSelectedUserFollowingPubkey(pubkey));
            }
        } catch (error) {
            // TODO: Error handling
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

            if (handleUnfollowUser && loggedInUser.publicKey === selectedUser.pubkey) {
                handleUnfollowUser(pubkey);
                dispatch(removeSelectedUserFollowingPubkey(pubkey));
            }
        } catch (error) {
            // TODO: Error handling
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
