import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./Auth/AuthProvider";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
