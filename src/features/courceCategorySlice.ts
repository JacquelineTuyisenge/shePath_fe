import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface CourseCategory {
    id: string;
    name: string;
    description: string;
}

interface CourseCategoryState {
    categories: CourseCategory[];
    loading: boolean;
    error: string | null;
}

const initialState: CourseCategoryState = {
    categories: [],
    loading: false,
    error: null,
};

export const fetchCourseCategories = createAsyncThunk("courseCategories/fetchCourses", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/api/courseCategories/");
        return response.data.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to load courses");
    }
});

const courseCategorySlice = createSlice({
    name: "courseCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourseCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCourseCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default courseCategorySlice.reducer;