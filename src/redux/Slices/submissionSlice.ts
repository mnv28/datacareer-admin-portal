import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api/axiosApi";
import { AxiosError } from 'axios';

export interface Submission {
  id: number;
  user: string;
  userId: string;
  question: string;
  dbType: string;
  status: string;
  dateTime: string;
  code: string;
}

interface SubmissionState {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  filters: {
    questionId: string;
    dbType: string;
    status: string;
    search: string;
  };
}

const initialState: SubmissionState = {
  submissions: [],
  loading: false,
  error: null,
  filters: {
    questionId: '',
    dbType: '',
    status: '',
    search: ''
  }
};

export const fetchSubmissions = createAsyncThunk(
  'submission/fetchAll',
  async (filters: {
    questionId?: string;
    dbType?: string;
    status?: string;
    search?: string;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.questionId) params.append('questionId', filters.questionId);
      if (filters.dbType) params.append('dbType', filters.dbType);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await apiInstance.get(`/api/submission/admin/getAll?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.submissions || [];
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

const submissionSlice = createSlice({
  name: 'submission',
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
      // Fetch Submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = submissionSlice.actions;
export default submissionSlice.reducer; 