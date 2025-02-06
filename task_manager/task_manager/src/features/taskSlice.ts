import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface TaskState {
    tasks: Task[];
}

const initialState: TaskState = {
    tasks: [],
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<string>) => {
            state.tasks.push({ id: Date.now(), text: action.payload, completed: false });
        },
        deleteTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        toggleComplete: (state, action: PayloadAction<number>) => {
            const task = state.tasks.find((task) => task.id === action.payload);
            if (task) task.completed = !task.completed;
        },
    },
});

export const { addTask, deleteTask, toggleComplete } = taskSlice.actions;
export default taskSlice.reducer;