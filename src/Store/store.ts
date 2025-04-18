import { configureStore } from "@reduxjs/toolkit";

import noteDataReducer from "./Features/noteDataSlice";
import primaryColorReducer from "./Features/primaryColorSlice";
import userReducer from "./Features/userSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        primaryColor: primaryColorReducer,
        noteData: noteDataReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
