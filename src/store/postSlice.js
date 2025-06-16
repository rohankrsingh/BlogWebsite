import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";

export const fetchHomePosts = createAsyncThunk(
  'posts/fetchHomePosts',
  async (_, { rejectWithValue }) => {
    try {
      const latestQuery = [
        Query.orderDesc('$createdAt'),
        Query.limit(6),
      ];
      const featuredQuery = [
        Query.orderDesc('likesCount'),
        Query.limit(3),
      ];
      const [latest, featured] = await Promise.all([
        appwriteService.getPosts(latestQuery),
        appwriteService.getPosts(featuredQuery),
      ]);
      return {
        latest: latest ? latest.documents : [],
        featured: featured ? featured.documents : [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Define an initial state
const initialState = {
  homePosts: null, // { latest: [], featured: [] }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  posts: [],
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomePosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.homePosts = action.payload;
      })
      .addCase(fetchHomePosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { addPost, removePost, clearPosts } = postSlice.actions;
export default postSlice.reducer;
