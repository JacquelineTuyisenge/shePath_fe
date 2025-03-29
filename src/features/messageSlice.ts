// features/messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

interface MessageState {
    messages: any[];
    loading: boolean;
    error: string | null;
}

const initialState: MessageState = {
    messages: [],
    loading: false,
    error: null,
}

// Async thunk for sending a message
export const sendMessage = createAsyncThunk('messages/sendMessage', async (formData: {email: string; message: string }) => {
    const response = await axiosInstance.post('/messages/', formData);
    return response.data.data; // Return the response data
});

export const getMessages = createAsyncThunk('messages/getMessages', async () => {
    const response = await axiosInstance.get('/messages/');
    return response.data.data;
});

export const getMessage = createAsyncThunk('messages/getSingleMessage', async (id: string) => {
    const response = await axiosInstance.get(`/messages/${id}`);
    return response.data.data;
})

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        clearMessageState: (state) => {
            state.error = null; 
            state.loading = false; 
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to send message';
            })
            .addCase(getMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch messages';
            })
            .addCase(getMessage.pending, (state) => { 
                state.loading = true; 
                state.error = null; 
            }) 
            .addCase(getMessage.fulfilled, (state, action) => { 
                state.loading = false; 
                state.messages = action.payload; 
            })
            .addCase(getMessage.rejected, (state, action) => {
                state.loading = false; 
                state.error = action.error.message || 'Failed to fetch message'; 
            });
            
    },
});
export const { clearMessageState } = messageSlice.actions;
export default messageSlice.reducer;