import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api/axiosApi";
import { Domain } from './domainSlice';
import { AxiosError } from 'axios';


export interface Company {
  id: number;
  name: string;
  category: string;
  status: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  Domains: Domain[];
  domains?: number[]; // For form handling
}

interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    status: string;
  };
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    status: ''
  }
};

export const fetchCompanies = createAsyncThunk(
  'company/fetchAll',
  async (filters: { search?: string; category?: string; status?: string }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const response = await apiInstance.get(`/api/company/admin/get-all-companies?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.companies || [];
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch companies');
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'company/delete',
  async (companyId: number, { rejectWithValue }) => {
    try {
      await apiInstance.delete(`/api/company/admin/delete/${companyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return companyId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete company');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/update',
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      console.log('Updating company with data:', {
        id,
        formData: Object.fromEntries(formData.entries())
      });

      const response = await apiInstance.put(`/api/company/admin/update/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Update response:', response.data);
      return response.data.company;
    } catch (error) {
      console.error('Update error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update company');
    }
  }
);

export const createCompany = createAsyncThunk(
  'company/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      console.log('Creating company with data:', Object.fromEntries(formData.entries()));

      const response = await apiInstance.post('/api/company/admin/create', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Create response:', response.data);
      return response.data.company;
    } catch (error) {
      console.error('Create error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create company');
    }
  }
);

const companySlice = createSlice({
  name: 'company',
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
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload || [];
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.companies = [];
      })
      // Delete Company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(company => company.id !== action.payload);
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = companySlice.actions;
export default companySlice.reducer; 