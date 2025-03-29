import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance'; 

interface Mentor {
    phoneNumber: string;
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    profile: string;
    status: boolean;
    role: string;
    address?: string;
    city?: string;
    country?: string;
    createdAt: string;
}

interface MentorState {
    mentors: Mentor[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}

const initialState: MentorState = {
    mentors: [],
    status: 'idle',
    error: null,
};

export const getMentors = createAsyncThunk<Mentor[], void>(
    'mentors/getMentors',
    async () => {
        const response = await axiosInstance.get('/api/auth/mentors'); // Adjust the URL based on your API structure
        return response.data.mentors; // Assuming the response structure contains mentors
    }
);

const mentorSlice = createSlice({
    name: 'mentors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMentors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMentors.fulfilled, (state, action: PayloadAction<Mentor[]>) => {
                state.status = 'succeeded';
                state.mentors = action.payload;
            })
            .addCase(getMentors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export default mentorSlice.reducer;