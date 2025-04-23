import { configureStore } from "@reduxjs/toolkit";

import noteDataReducer from "./Features/noteDataSlice";
import primaryColorReducer from "./Features/primaryColorSlice";
import relaysReducer from "./Features/relaysSlice";
import scrollPositionReducer from "./Features/scrollPositionSlice";
import selectedUserReducer from "./Features/selectedUserSlice";
import userReducer from "./Features/userSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        primaryColor: primaryColorReducer,
        noteData: noteDataReducer,
        scrollPosition: scrollPositionReducer,
        relays: relaysReducer,
        selectedUser: selectedUserReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
