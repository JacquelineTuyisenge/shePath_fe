import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface Course {
    categoryName: string;
    id: string;
    title: string;
    description: string;
    content: string;
    categoryId: string;
}

interface CourseState {
    courses: Course[];
    loading: boolean;
    error: string | null;
    singleCourse: Course | null;
}

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null,
    singleCourse: null,
};

export const addCourse = createAsyncThunk(
    "addCourse",
    async(courseData: {title: string; description: string; content: string; categoryId: string}, {rejectWithValue}) => {
        try{
            const response = await axiosInstance.post(`api/courses/${courseData.categoryId}`, courseData);
            return response.data.data;
        }catch(error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to create course")
        }
    }
);

export const fetchCourses = createAsyncThunk("courses/fetchCourses", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/api/courses/");
        return response.data.data;
        // console.log("hgfrtyuikjhgfrt6ujhbv", response.data.data)
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to load courses");
    }
});

export const fetchCourseDetails = createAsyncThunk(
    "singleCourse",
    async (id: string, { rejectWithValue }) => {
      console.log("Fetching course with ID:", id);
      try {
        const {data} = await axiosInstance.get(`/api/courses/${id}`);
        return data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch course details");
      }
    }
  );

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCourseDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchCourseDetails.fulfilled, 
                (state, action) => {
                    state.loading = false;
                    state.singleCourse = action.payload;

            })
            .addCase(fetchCourseDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
            });
        
    },
});

export default courseSlice.reducer;