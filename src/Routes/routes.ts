export const PROFILE_ROUTE_BASE = "/profile";
export const EVENT_ROUTE_BASE = "/event";

export const ROUTES = {
    HOME: "/",
    NOTIFICATIONS: "/notifications",
    MESSAGES: "/messages",
    BOOKMARKS: "/bookmarks",
    SETTINGS: "/settings",
    PROFILE: `${PROFILE_ROUTE_BASE}/:key`,
    SETTINGS_KEY_MANAGEMENT: "/settings/key-management",
    SETTINGS_APPEARANCE: "/settings/appearance",
    SETTINGS_PROFILE: "/settings/profile",
    EVENT: `${EVENT_ROUTE_BASE}/:nevent`,
};
