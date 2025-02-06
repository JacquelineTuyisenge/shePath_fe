import { configureStore } from "@reduxjs/toolkit";
import tasksRedcer from './features/taskSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksRedcer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;