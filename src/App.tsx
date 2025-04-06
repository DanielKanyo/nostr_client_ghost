import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Home from "./Layout/Home";
import Landing from "./Layout/Landing";
import Layout from "./Layout/Layout";
import Settings from "./Layout/Settings";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Outlet />}>
                    <Route index element={<Landing />} />
                    <Route path="home" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
