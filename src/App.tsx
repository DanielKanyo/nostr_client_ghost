import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layouts/Layout";
import Home from "./Pages/Home";
import Messages from "./Pages/Messages";
import Notifications from "./Pages/Notifications";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import AppearanceSettings from "./Pages/Settings/AppearanceSettings";
import KeyManagement from "./Pages/Settings/KeyManagement";
import ProfileSettings from "./Pages/Settings/ProfileSettings";
import { ROUTES } from "./Routes/routes";
import store from "./Store/store";

export default function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Routes>
                    <Route path={ROUTES.HOME} element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
                        <Route path={ROUTES.MESSAGES} element={<Messages />} />
                        <Route path={ROUTES.SETTINGS} element={<Settings />} />
                        <Route path={ROUTES.SETTINGS_KEY_MANAGEMENT} element={<KeyManagement />} />
                        <Route path={ROUTES.SETTINGS_APPEARANCE} element={<AppearanceSettings />} />
                        <Route path={ROUTES.SETTINGS_PROFILE} element={<ProfileSettings />} />
                        <Route path={ROUTES.PROFILE} element={<Profile />} />
                    </Route>
                </Routes>
            </Provider>
        </BrowserRouter>
    );
}
