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
  users: any[]; // dynamic fields
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
  };
  fields: string[];
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: ''
  },
  fields: []
};

export const fetchUsersPreview = createAsyncThunk(
  'user/fetchUsersPreview',
  async (
    params: { fields: string[]; search?: string; dateRange?: string },
    { rejectWithValue }
  ) => {
    try {
      const urlParams = new URLSearchParams();
      params.fields.forEach(field => urlParams.append('fields', field));
      if (params.search !== undefined) urlParams.append('search', params.search);
      if (params.dateRange !== undefined) urlParams.append('dateRange', params.dateRange);
      const response = await apiInstance.get(`/api/export/admin/previewUsersExport?${urlParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'user/toggleStatus',
  async ({ userId, newStatus }: { userId: number; newStatus: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiInstance.patch(
        `/api/auth/admin/user/status`,
        { userId, status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      dispatch(fetchUsersPreview({ fields: ['id', 'name', 'email', 'totalAttempted', 'lastLogin', 'status'] }));
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
      // Fetch Users Preview
      .addCase(fetchUsersPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersPreview.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersPreview.rejected, (state, action) => {
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