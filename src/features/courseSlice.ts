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
    message: string | null ;
    singleCourse: Course | null;
}

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null,
    message: null,
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

  export const updateCourse = createAsyncThunk("roles/updateRole",
    async ({ id, title, description, content }: { id: string; title: string, description: string, content: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/api/courses/${id}`, { title, description, content });
            return { id, title, description, content, message: response.data.message };
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to update a course!");
        }
    });

  export const deleteCourse = createAsyncThunk("deleteCourse",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/courses/${id}`);
            return { id, message: response.data.message };
        }catch(error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete course");
        }
    }
);

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
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
            })
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.courses.findIndex(course => course.id === action.payload.id);
                if(index !== -1) {
                    state.courses[index] = {...state.courses[index], ...action.payload};
                }
                state.message = action.payload.message;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                // Fix: Remove the course by filtering it out from the courses array
                state.courses = state.courses.filter((course) => course.id !== action.payload.id);
                state.message = action.payload.message;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        
    },
});

export const { clearMessage } = courseSlice.actions;
export default courseSlice.reducer;