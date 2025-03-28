import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

interface ChatMessage {
    createdAt: string;
    id: string;
    sender: {
        id: string; // Assuming you have an ID for the sender
        firstName: string;
        lastName: string;
        // Add other fields as necessary
    };
    receiver: {
        id: string; // Assuming you have an ID for the receiver
        firstName: string;
        lastName: string;
        // Add other fields as necessary
    };
    content: string;
    timestamp: string;
}

interface ChatState {
    chats: ChatMessage[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}

// Initial state with type
const initialState: ChatState = {
    chats: [],
    status: 'idle',
    error: null,
};

// Async thunks with explicit return types
export const sendChat = createAsyncThunk<ChatMessage, { senderId: string; receiverId: string; content: string }>(
    'chats/sendChat',
    async (chatData) => {
        const response = await axiosInstance.post('/chats/', chatData);
        return response.data;
    }
);

export const getChats = createAsyncThunk<ChatMessage[], string>(
    'chats/getChats',
    async (userId) => {
        const response = await axiosInstance.get(`/chats/${userId}`);
        return response.data.chats;
    }
);

export const getAllChats = createAsyncThunk<ChatMessage[], void>(
    'chats/getAllChats',
    async () => {
        const response = await axiosInstance.get('/chats/'); 
        return response.data.chats;
    }
);

// Slice with pending, fulfilled, and rejected cases
const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getChats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getChats.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
                state.status = 'succeeded';
                state.chats = action.payload;
            })
            .addCase(getChats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(sendChat.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendChat.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
                state.status = 'succeeded';
                state.chats.push(action.payload);
            })
            .addCase(sendChat.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(getAllChats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllChats.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
                state.status = 'succeeded';
                state.chats = action.payload;
            })
            .addCase(getAllChats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export default chatSlice.reducer;
