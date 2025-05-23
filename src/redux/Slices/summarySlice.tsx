import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "../../api/axiosApi";

interface SummaryCounts {
    totalQuestions: number;
    totalCompanies: number;
    totalUsers: number;
    totalSubmissions: number;
}

interface SummaryState {
    counts: SummaryCounts | null;
    loading: boolean;
    error: string | null;
}

const initialState: SummaryState = {
    counts: null,
    loading: false,
    error: null,
};

export const fetchSummaryCounts = createAsyncThunk(
    'summary/fetchCounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get('/api/summary/admin/getSummaryCounts');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary counts');
        }
    }
);

const summarySlice = createSlice({
    name: 'summary',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSummaryCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummaryCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.counts = action.payload;
                state.error = null;
            })
            .addCase(fetchSummaryCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default summarySlice.reducer; 