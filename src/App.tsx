import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Feed from "./Layout/Feed";
import Layout from "./Layout/Layout";
import Settings from "./Layout/Settings";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="feed" replace />} />
                    <Route path="feed" element={<Feed />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
