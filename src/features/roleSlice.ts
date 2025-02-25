import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { create } from "domain";
import axiosInstance from "../axiosInstance";

export interface Role {
    id: string;
    name: string;
}

interface RoleState {
    roles: Role[];
    loading: boolean;
    error: string | null;
}

const initialState: RoleState = {
    roles: [],
    loading: false,
    error: null,
};

export const getRoles = createAsyncThunk<Role[], void>(
    "roles/getRoles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/roles/all");
            return response.data.roles;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to fetch roles!");
        }
    });

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(getRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default roleSlice.reducer;