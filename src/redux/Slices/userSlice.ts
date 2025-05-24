import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api/axiosApi";
import { AxiosError } from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  totalAttempted: number;
  lastLogin: string | null;
  status: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
  };
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: ''
  }
};

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (filters: { search?: string; status?: string } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);

      const response = await apiInstance.get(`/api/auth/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.users;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'user/toggleStatus',
  async ({ userId, newStatus }: { userId: number; newStatus: string }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.patch(`/api/auth/admin/users/${userId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update user status');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
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
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle User Status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = userSlice.actions;
export default userSlice.reducer; 