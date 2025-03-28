// src/features/courseSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface Course {
  createdAt: string;
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  categoryName: string;
  image?: string;
}

interface CourseProgress {
  progress: number;
  completed: boolean;
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  message: string | null;
  singleCourse: Course | null;
  progress: { [key: string]: CourseProgress }; // Store progress by courseId
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
  message: null,
  singleCourse: null,
  progress: {}, // Initialize progress object
};

export const addCourse = createAsyncThunk(
  "addCourse",
  async (courseData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `api/courses/${courseData.get("categoryId")}`,
        courseData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create course");
    }
  }
);

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/courses/");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load courses");
    }
  }
);

export const fetchCourseDetails = createAsyncThunk(
  "singleCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/courses/${id}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch course details");
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async (courseData: FormData, { rejectWithValue }) => {
    try {
      const id = courseData.get("id") as string;
      const response = await axiosInstance.patch(
        `/api/courses/${id}`,
        courseData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update course");
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/courses/${id}`);
      return { id, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete course");
    }
  }
);

// New thunk to fetch course progress
export const fetchCourseProgress = createAsyncThunk(
  "courses/fetchCourseProgress",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/progress/${courseId}`);
      return { courseId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch progress");
    }
  }
);

// New thunk to update course progress
export const updateCourseProgress = createAsyncThunk(
  "courses/updateCourseProgress",
  async (
    { courseId, progress, completed }: { courseId: string; progress: number; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(`/progress/${courseId}`, {
        progress,
        completed,
      });
      return { courseId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update progress");
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
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
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
        const index = state.courses.findIndex((course) => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = { ...state.courses[index], ...action.payload };
        }
        state.message = action.payload.message;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((course) => course.id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // New cases for progress
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress[action.payload.courseId] = {
          progress: action.payload.progress,
          completed: action.payload.completed,
        };
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCourseProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress[action.payload.courseId] = {
          progress: action.payload.progress,
          completed: action.payload.completed,
        };
      })
      .addCase(updateCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessage } = courseSlice.actions;
export default courseSlice.reducer;