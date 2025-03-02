import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/userSlice";
import roleReducer from "./features/roleSlice";
import courseSlice from "./features/courseSlice";
import courseCategortReducer from "./features/courceCategorySlice";

export const store = configureStore({
    reducer: {
        users: usersReducer,
        roles: roleReducer,
        courses: courseSlice,
        categories: courseCategortReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;