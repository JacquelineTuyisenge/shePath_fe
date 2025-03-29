import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export interface Role {
    id: string;
    name: string;
}

interface RoleState {
    roles: Role[];
    loading: boolean;
    error: string | null;
    message: string | null;
}

const initialState: RoleState = {
    roles: [],
    loading: false,
    error: null,
    message: null
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

export const addRole = createAsyncThunk("roles/addRole", 
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("api/roles/new", { role: name });
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to add role!");
        }
    });

export const updateRole = createAsyncThunk("roles/updateRole",
    async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`api/roles/update/${id}`, { name });
            return { id, name, message: response.data.message };
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to update role!");
        }
    });

export const deleteRole = createAsyncThunk("roles/deleteRole",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`api/roles/delete/${id}`);
            return { id, message: response.data.message };
        }catch(error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete role");
        }
    }
);

export const assignRole = createAsyncThunk(
    "roles/assignRole",
    async ({ userId, role }: { userId: string; role: string }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.patch(`api/roles/assign/${userId}`, { role });
        return { updatedUser: response.data.data, message: response.data.message }; // Return updatedUser
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to assign role!");
      }
    }
  );

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
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
            })
            .addCase(addRole.fulfilled, (state, action) => {
                state.roles.push(action.payload.newRole);
                state.message = action.payload.message;
            })
            .addCase(addRole.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                const index = state.roles.findIndex((role) => role.id === action.payload.id);
                if (index !== -1) state.roles[index].name = action.payload.name;
                state.message = action.payload.message;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.roles = state.roles.filter((role) => role.id !== action.payload.id);
                state.message = action.payload.message;
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(assignRole.fulfilled, (state, action) => {
                state.message = action.payload.message;
            })
            .addCase(assignRole.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearMessage } = roleSlice.actions;
export default roleSlice.reducer;