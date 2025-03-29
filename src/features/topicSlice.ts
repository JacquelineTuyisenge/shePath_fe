import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

export interface Topic {
  comments: any;
  likes: any;
  user: any;
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TopicState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

const initialState: TopicState = {
  topics: [],
  loading: false,
  error: null,
};

export const fetchTopics = createAsyncThunk('topics/fetchTopics', async () => {
  const response = await axiosInstance.get('/topics/');
  return response.data.topics;
});

export const fetchSingleTopic = createAsyncThunk('topics/fetchSingleTopic', async (id: string, {rejectWithValue}) => {
  try{
    const {data} = await axiosInstance.get(`/topics/${id}`);
    return data.topic;
  } catch(error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch category");
  }
});

export const createTopic = createAsyncThunk('topics/createTopic', async (topicData: { content: string; imageUrl?: File | null }) => {
  const formData = new FormData();
  formData.append('content', topicData.content);
  if (topicData.imageUrl) formData.append('imageUrl', topicData.imageUrl);

  const response = await axiosInstance.post('/topics/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.topic;
});

export const updateTopic = createAsyncThunk('topics/updateTopic', async ({ id, content, imageUrl }: { id: string; content: string; imageUrl?: File | null }) => {
  const formData = new FormData();
  formData.append('content', content);
  if (imageUrl) {
    formData.append('imageUrl', imageUrl); // Append the new image file
  }

  const response = await axiosInstance.patch(`/topics/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.topic;
});

export const deleteTopic = createAsyncThunk('topics/deleteTopic', async (id: string) => {
  const response = await axiosInstance.delete(`/topics/${id}`);
  return response.data.topic;
});

const topicSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch topics';
      })
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topics.push(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create topic';
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        const updatedTopic = action.payload; // Ensure the updated topic contains the correct user info

        const index = state.topics.findIndex((topic) => topic.id === updatedTopic.id);
        if (index !== -1) {
          // Update the topic at the correct index
          state.topics[index] = updatedTopic;
        }
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topics = state.topics.filter((topic) => topic.id !== action.payload.id);
      });
  },
});

export default topicSlice.reducer;
