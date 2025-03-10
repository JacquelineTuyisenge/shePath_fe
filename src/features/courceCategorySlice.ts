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
  message: string | null;
  singleCategory: CourseCategory | null;
}

const initialState: CourseCategoryState = {
  categories: [],
  loading: false,
  error: null,
  message: null,
  singleCategory: null,
};

// Fetch all course categories
export const fetchCourseCategories = createAsyncThunk(
  "courseCategories/fetchCourseCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/courseCategories/");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load categories");
    }
  }
);

// Fetch a single course category by ID
export const fetchCourseCategory = createAsyncThunk(
  "courseCategories/fetchCourseCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/courseCategories/${id}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch category");
    }
  }
);

// Add a new course category
export const addCourseCategory = createAsyncThunk(
  "courseCategories/addCourseCategory",
  async ({ name, description }: { name: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/courseCategories/", { name, description });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category");
    }
  }
);

// Update a course category
export const updateCourseCategory = createAsyncThunk(
  "courseCategories/updateCourseCategory",
  async (
    { id, name, description }: { id: string; name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/api/courseCategories/${id}`, { name, description });
      return { id, name, description, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

// Delete a course category
export const deleteCourseCategory = createAsyncThunk(
  "courseCategories/deleteCourseCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/courseCategories/${id}`);
      return { id, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);

const courseCategorySlice = createSlice({
  name: "courseCategories",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
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
      })
      .addCase(fetchCourseCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCategory = action.payload;
      })
      .addCase(fetchCourseCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCourseCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCourseCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = { ...state.categories[index], ...action.payload };
        }
        state.message = action.payload.message;
      })
      .addCase(deleteCourseCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload.id
        );
        state.message = action.payload.message;
      })
      .addCase(deleteCourseCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearMessage } = courseCategorySlice.actions;
export default courseCategorySlice.reducer;
