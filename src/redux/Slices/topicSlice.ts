import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api/axiosApi";
import { AxiosError } from 'axios';

export interface Topic {
  id: number;
  name: string;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TopicState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
  };
}

const initialState: TopicState = {
  topics: [],
  loading: false,
  error: null,
  filters: {
    search: ''
  }
};

export const fetchTopics = createAsyncThunk(
  'topic/fetchAll',
  async (filters: { search?: string }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);

      const response = await apiInstance.get(`/api/topic/admin/all?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.topics || [];
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch topics');
    }
  }
);

export const createTopic = createAsyncThunk(
  'topic/create',
  async (topicData: Partial<Topic>, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('/api/topic/admin/create', topicData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.topic;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create topic');
    }
  }
);

export const updateTopic = createAsyncThunk(
  'topic/update',
  async ({ id, data }: { id: number; data: Partial<Topic> }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.put(`/api/topic/admin/update/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.topic;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update topic');
    }
  }
);

export const deleteTopic = createAsyncThunk(
  'topic/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiInstance.delete(`/api/topic/admin/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete topic');
    }
  }
);

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Topics
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Topic
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.push(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Topic
      .addCase(updateTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.topics.findIndex(topic => topic.id === action.payload.id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Topic
      .addCase(deleteTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = state.topics.filter(topic => topic.id !== action.payload);
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = topicSlice.actions;
export default topicSlice.reducer; 