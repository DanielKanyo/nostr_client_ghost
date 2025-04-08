import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./Auth/AuthProvider";
import MainLayout from "./Components/MainLayout";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import AccountSettings from "./Pages/Settings/AccountSettings";
import AppearanceSettings from "./Pages/Settings/AppearanceSettings";
import { ROUTES } from "./Routes/routes";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path={ROUTES.HOME} element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path={ROUTES.PROFILE} element={<Profile />} />

                        <Route path={ROUTES.SETTINGS} element={<Settings />} />
                        <Route path={ROUTES.SETTINGS_ACCOUNT} element={<AccountSettings />} />
                        <Route path={ROUTES.SETTINGS_APPEARANCE} element={<AppearanceSettings />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
