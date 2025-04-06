import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const storedPrivateKey = localStorage.getItem("nostrPrivateKey");
        const storedPublicKey = localStorage.getItem("nostrPublicKey");

        if (!storedPrivateKey || !storedPublicKey) {
            navigate("/");
        }
    }, []);

    return <div>Home</div>;
}
