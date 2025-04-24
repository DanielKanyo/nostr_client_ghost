import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layouts/Layout";
import Bookmarks from "./Pages/Bookmarks";
import Event from "./Pages/Event";
import Home from "./Pages/Home";
import Messages from "./Pages/Messages";
import Notifications from "./Pages/Notifications";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import AppearanceSettings from "./Pages/Settings/AppearanceSettings";
import MutedAccounts from "./Pages/Settings/MutedAccounts";
import KeyManagement from "./Pages/Settings/KeyManagement";
import Network from "./Pages/Settings/Network";
import ProfileSettings from "./Pages/Settings/ProfileSettings";
import { ROUTES } from "./Routes/routes";
import "./Shared/Styles/global.css";
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
                        <Route path={ROUTES.SETTINGS_NETWORK} element={<Network />} />
                        <Route path={ROUTES.SETTINGS_MUTEDED_ACCOUNTS} element={<MutedAccounts />} />
                        <Route path={ROUTES.PROFILE} element={<Profile />} />
                        <Route path={ROUTES.BOOKMARKS} element={<Bookmarks />} />
                        <Route path={ROUTES.EVENT} element={<Event />} />
                    </Route>
                </Routes>
            </Provider>
        </BrowserRouter>
    );
}
