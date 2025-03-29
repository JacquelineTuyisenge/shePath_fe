import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

interface ChatMessage {
    createdAt: string;
    id: string;
    sender: {
      profile: string; id: string; firstName: string; lastName: string 
};
    receiver: { id: string; firstName: string; lastName: string };
    content: string;
    timestamp: string;
}

interface ChatState {
    chats: ChatMessage[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}

const initialState: ChatState = {
    chats: [],
    status: 'idle',
    error: null,
};

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

const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<ChatMessage>) => {
            state.chats.push(action.payload);
        },
        removeChat: (state, action: PayloadAction<string>) => {
            state.chats = state.chats.filter((chat) => chat.id !== action.payload);
        },
    },
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
                const tempIndex = state.chats.findIndex((chat) => chat.id.startsWith("temp-"));
                if (tempIndex !== -1) state.chats.splice(tempIndex, 1); // Replace temp message
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

export const { addChat, removeChat } = chatSlice.actions;
export default chatSlice.reducer;