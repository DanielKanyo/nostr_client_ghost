import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SimplePool } from "nostr-tools";

import { authenticate, fetchUserMetadata, UserMetadata } from "../Service/service";
import { LoadingStateEnum, LoadingStates } from "../Util/util";

type AuthContextType = {
    loadingState: LoadingStates;
    userMetadata: UserMetadata | null;
};

const AuthContext = createContext<AuthContextType>({
    loadingState: LoadingStateEnum.LOADING,
    userMetadata: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loadingState, setLoadingState] = useState<LoadingStates>(LoadingStateEnum.LOADING);
    const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
            const storedPublicKey = localStorage.getItem("nostrPublicKey");

            if (storedPrivateKey && storedPublicKey) {
                try {
                    const pool = new SimplePool();
                    const publicKey = await authenticate(storedPrivateKey, pool);

                    if (publicKey === storedPublicKey) {
                        const metadata = await fetchUserMetadata(publicKey, pool);

                        setUserMetadata(metadata);
                        setLoadingState(LoadingStateEnum.IDLE);
                    } else {
                        throw new Error("Public key mismatch");
                    }
                } catch {
                    localStorage.removeItem("nostrPrivateKey");
                    localStorage.removeItem("nostrPublicKey");

                    setLoadingState(LoadingStateEnum.REDIRECTING);
                    navigate("/");
                }
            } else {
                setLoadingState(LoadingStateEnum.REDIRECTING);
                navigate("/");
            }
        };

        authenticateUser();
    }, []);

    return <AuthContext.Provider value={{ loadingState, userMetadata }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
