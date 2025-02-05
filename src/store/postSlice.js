import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appwriteService from "../appwrite/config"; // Adjust the path accordingly

// Define an initial state
const initialState = {
  posts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Create the slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post.$id !== action.payload);
    },
    clearPosts: (state) => {
      state.posts = [];
    },
  },
  
});

// Export actions and reducer
export const { addPost, removePost, clearPosts } = postSlice.actions;
export default postSlice.reducer;
