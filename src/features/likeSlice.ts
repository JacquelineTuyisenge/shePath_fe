import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// Define the initial state for likes
interface LikeState {
  likedTopics: string[]; // Array of topic IDs that the user has liked
  loading: boolean;
  error: string | null;
}
const storedLikes = localStorage.getItem("likedTopics");

// Initial state
const initialState: LikeState = {
  likedTopics: storedLikes ? JSON.parse(storedLikes) : [],
  loading: false,
  error: null,
};

// Async thunk for toggling a like on a topic
export const toggleLike = createAsyncThunk(
  "likes/toggleLike",
  async ({ topicId }: { topicId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { likes: LikeState };
      const isLiked = state.likes.likedTopics.includes(topicId); // Determine if already liked

      // If already liked, send an unlike request, otherwise send a like request
      const response = await axiosInstance.post("/likes/", { 
        topicId,
        action: isLiked ? "unlike" : "like"
      });

      console.log('responseee on liking', response);

      return { topicId, liked: !isLiked }; // Return updated like state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    toggleLikeLocal: (state, action) => {
      const topicId = action.payload;
      if (state.likedTopics.includes(topicId)) {
        state.likedTopics = state.likedTopics.filter((id) => id !== topicId);
      } else {
        state.likedTopics.push(topicId);
      }
      localStorage.setItem("likedTopics", JSON.stringify(state.likedTopics));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { topicId, liked } = action.payload;
        if (liked) {
          state.likedTopics.push(topicId);
        } else {
          state.likedTopics = state.likedTopics.filter(id => id !== topicId);
        }
        localStorage.setItem("likedTopics", JSON.stringify(state.likedTopics));
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { toggleLikeLocal } = likeSlice.actions;
export default likeSlice.reducer;
