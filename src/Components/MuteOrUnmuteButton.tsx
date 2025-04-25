import { Button } from "@mantine/core";

import { updateMutedAccounts } from "../Store/Features/mutedAccountsSlice";
import { useAppDispatch, useAppSelector } from "../Store/hook";

interface MuteOrUnmuteButtonProps {
    pubkey: string;
}

function MuteOrUnmuteButton({ pubkey }: MuteOrUnmuteButtonProps) {
    const mutedAccounts = useAppSelector((state) => state.mutedAccounts);
    const { color } = useAppSelector((state) => state.primaryColor);
    const dispatch = useAppDispatch();

    const updateLocalStorage = (updated: string[]) => {
        localStorage.setItem("nostrMutedAccounts", JSON.stringify(updated));
    };

    const handleUnmute = (e: React.MouseEvent, pubkey: string) => {
        e.stopPropagation();

        const updated = mutedAccounts.filter((pk) => pk !== pubkey);

        dispatch(updateMutedAccounts(updated));
        updateLocalStorage(updated);
    };

    const handleMute = (e: React.MouseEvent, pubkey: string) => {
        e.stopPropagation();

        const updated = [...mutedAccounts, pubkey];

        dispatch(updateMutedAccounts(updated));
        updateLocalStorage(updated);
    };

    return (
        <>
            {mutedAccounts.includes(pubkey) ? (
                <Button variant="filled" aria-label="unmute" radius="xl" color={color} onClick={(e) => handleUnmute(e, pubkey)}>
                    Unmute
                </Button>
            ) : (
                <Button variant="filled" aria-label="unmute" radius="xl" color={color} onClick={(e) => handleMute(e, pubkey)}>
                    Unmute
                </Button>
            )}
        </>
    );
}

export default MuteOrUnmuteButton;
