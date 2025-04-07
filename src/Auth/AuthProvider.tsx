import { createContext, useContext, useEffect, useState } from "react";

import { SimplePool } from "nostr-tools";

import { authenticate, fetchUserMetadata, UserMetadata } from "../Service/service";

type AuthContextType = {
    loading: boolean;
    userAuthenticated: boolean;
    userMetadata: UserMetadata | null;
    updateAuthenticatedState: (state: boolean, metadata: UserMetadata | null) => Promise<void>; // Add login function
};

const AuthContext = createContext<AuthContextType>({
    loading: true,
    userMetadata: null,
    userAuthenticated: false,
    updateAuthenticatedState: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);
    const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

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

                        setUserAuthenticated(true);
                        setUserMetadata(metadata);
                        setLoading(false);
                    } else {
                        throw new Error("Public key mismatch...");
                    }
                } catch {
                    localStorage.removeItem("nostrPrivateKey");
                    localStorage.removeItem("nostrPublicKey");

                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        authenticateUser();
    }, []);

    const updateAuthenticatedState = async (state: boolean, metadata: UserMetadata | null) => {
        setLoading(true);

        setUserAuthenticated(state);
        setUserMetadata(metadata);

        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ loading, userAuthenticated, userMetadata, updateAuthenticatedState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
