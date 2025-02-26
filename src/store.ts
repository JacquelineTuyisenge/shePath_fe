import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/userSlice";
import roleReducer from "./features/roleSlice";
export const store = configureStore({
    reducer: {
        users: usersReducer,
        roles: roleReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;