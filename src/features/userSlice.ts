import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface User {
    profile?: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    createdAt: string;
    phoneNumber?: string;
    gender?: string;
    birthDate?: string;
    country?: string;
    city?: string;
    address?: string;

}

interface UserState {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
};

export const getUsers = createAsyncThunk<User[], void>(
    "users/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/auth/users");
            return response.data.users;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to fetch users!");
        }
        
})

export const getProfile = createAsyncThunk<User, void>(
    "users/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/auth/profile");

            return response.data.userProfile;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to fetch profile!");
        }
    }
);

export const editProfile = createAsyncThunk<User, FormData>(
    "users/editProfile",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch("/api/auth/profile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            });
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to update profile!");
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser  = action.payload; // Store the current user's profile
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(editProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser  = action.payload; // Update the current user's profile
            })
            .addCase(editProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;