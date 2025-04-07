import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { AuthProvider } from "./Auth/AuthProvider";
import Home from "./Layout/Home";
import Landing from "./Layout/Landing";
import Layout from "./Layout/Layout";
import Profile from "./Layout/Profile";
import Settings from "./Layout/Settings";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Outlet />}>
                        <Route index element={<Landing />} />
                        <Route path="home" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
