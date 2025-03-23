import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/userSlice";
import roleReducer from "./features/roleSlice";
import courseSlice from "./features/courseSlice";
import courseCategortReducer from "./features/courceCategorySlice";
import topicReducer from "./features/topicSlice";
import messageReducer from "./features/messageSlice";
import commentReducer from "./features/commentSlice";
import likeReducer from "./features/likeSlice";

export const store = configureStore({
    reducer: {
        users: usersReducer,
        roles: roleReducer,
        courses: courseSlice,
        categories: courseCategortReducer,
        topics: topicReducer,
        sms: messageReducer,
        comments: commentReducer,
        likes: likeReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;