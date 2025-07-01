import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api/axiosApi";
import { AxiosError } from 'axios';

export interface Domain {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DomainState {
  domains: Domain[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
  };
}

const initialState: DomainState = {
  domains: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: ''
  }
};

export const fetchDomains = createAsyncThunk(
  'domain/fetchDomains',
  async (filters: { search?: string; status?: string } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);

      const response = await apiInstance.get(`/api/domain/admin/getAll?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.domains;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch domains');
    }
  }
);

export const fetchActiveDomains = createAsyncThunk(
  'domain/fetchActiveDomains',
  async (_,{ rejectWithValue }) => {
    try {
      const response = await apiInstance.get('/api/domain/admin/getall/active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.domains;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch active domains');
    }
  }
)

export const fetchDomainById = createAsyncThunk(
  'domain/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/api/domain/admin/getById/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.domain;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch domain');
    }
  }
);

export const createDomain = createAsyncThunk(
  'domain/create',
  async (domainData: { name: string; description: string; status: string }, { rejectWithValue }) => {
    try {
      console.log('Creating domain with data:', domainData);

      const response = await apiInstance.post('/api/domain/admin/create', domainData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Create response:', response.data);
      return response.data.domain;
    } catch (error) {
      console.error('Create error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create domain');
    }
  }
);

export const updateDomain = createAsyncThunk(
  'domain/update',
  async ({ id, domainData }: { id: number; domainData: { name: string; description: string; status: string } }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.put(`/api/domain/admin/update/${id}`, domainData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data.domain;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update domain');
    }
  }
);

export const deleteDomain = createAsyncThunk(
  'domain/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiInstance.delete(`/api/domain/admin/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete domain');
    }
  }
);

const domainSlice = createSlice({
  name: 'domain',
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
      // Fetch Domains
      .addCase(fetchDomains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = action.payload;
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Fetch Active Domains
      .addCase(fetchActiveDomains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveDomains.fulfilled, (state, action) => {
        state.loading = false;  
        state.domains = action.payload;
      })
      .addCase(fetchActiveDomains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Domain
      .addCase(createDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.domains.push(action.payload);
      })
      .addCase(createDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Domain
      .addCase(updateDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDomain.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.domains.findIndex(domain => domain.id === action.payload.id);
        if (index !== -1) {
          state.domains[index] = action.payload;
        }
      })
      .addCase(updateDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Domain
      .addCase(deleteDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.domains = state.domains.filter(domain => domain.id !== action.payload);
      })
      .addCase(deleteDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = domainSlice.actions;
export default domainSlice.reducer; 