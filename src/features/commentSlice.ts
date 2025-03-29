import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

interface Comment {
  id: string;
  content: string;
  userId: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// Async thunk for creating a comment
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ topicId, content }: { topicId: string; content: string }, { rejectWithValue }) => {
      try {
          const response = await axiosInstance.post('/comments', { topicId, content }, {
          });
          return response.data.comment; // Return the created comment
      } catch (error: any) {
          return rejectWithValue(error.response.data.message);
      }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.loading = false;
      state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
          .addCase(createComment.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(createComment.fulfilled, (state, action) => {
              state.loading = false;
              state.comments.push(action.payload); // Add the new comment to the state
          })
          .addCase(createComment.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string; // Set the error message
          });
  },
});
export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
