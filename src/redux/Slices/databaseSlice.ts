import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "@/api/axiosApi"; // If you use axios instance

export interface Database {
  id: number;
  name: string;
  tables: number[]; // Array of table IDs
  schemaContent: string;
  schemaImage: string | File | null;
  createdAt: string;
  updatedAt: string;
}



interface DatabaseState {
  databases: Database[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
  };
}

const initialState: DatabaseState = {
  databases: [],
  loading: false,
  error: null,
  filters: {
    search: ''
  }
};

export const fetchDatabases = createAsyncThunk(
  'database/fetchAll',
  async (filters: { search?: string }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      const response = await apiInstance.get('/api/dynamicTableInfo/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data || response.data;

      // Map API fields to your Database type
      const mapped = data.map((db: any) => ({
        id: db.id,
        name: db.databaseName,
        tables: db.dynamicTableIds || db.tables || [],
        schemaContent: db.schemaContent,
        schemaImage: db.schemaImageUrl || null,
        createdAt: db.createdAt,
        updatedAt: db.updatedAt,
      }));

      // Optionally filter on client
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return mapped.filter((db: any) =>
          db.name.toLowerCase().includes(searchLower) ||
          db.schemaContent.toLowerCase().includes(searchLower)
        );
      }
      return mapped;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch databases');
    }
  }
);

export const createDatabase = createAsyncThunk(
  'database/create',
  async (data: Partial<Database>, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      const formDataToSend = new FormData();
      formDataToSend.append('dynamicTableIds', JSON.stringify(data.tables));
      formDataToSend.append('schemaContent', data.schemaContent || '');
      formDataToSend.append('databaseName', data.name || '');

      if (data.schemaImage) {
        if (data.schemaImage instanceof File) {
          formDataToSend.append('schemaImageUrl', data.schemaImage);
        } else if (typeof data.schemaImage === 'string') {
          const response = await fetch(data.schemaImage);
          const blob = await response.blob();
          formDataToSend.append('schemaImageUrl', blob, 'schema-image.jpg');
        }
      }
      // const response = await apiInstance.post('/api/dynamicTableInfo/admin', formDataToSend, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await fetch('http://localhost:3000/api/dynamicTableInfo/admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to save database');
      }

      const result = await response.json();
      // Map API response to your Database type if needed
      return {
        id: result.id,
        name: result.databaseName,
        tables: result.dynamicTableIds || [],
        schemaContent: result.schemaContent,
        schemaImage: result.schemaImageUrl || null,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save database');
    }
  }
);

export const updateDatabase = createAsyncThunk(
  'database/update',
  async ({ id, data }: { id: number; data: Partial<Database> }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      const formDataToSend = new FormData();
      formDataToSend.append('dynamicTableIds', JSON.stringify(data.tables));
      formDataToSend.append('schemaContent', data.schemaContent || '');
      formDataToSend.append('databaseName', data.name || '');

      if (data.schemaImage) {
        if (data.schemaImage instanceof File) {
          formDataToSend.append('schemaImageUrl', data.schemaImage);
        } else if (typeof data.schemaImage === 'string') {
          const response = await fetch(data.schemaImage);
          const blob = await response.blob();
          formDataToSend.append('schemaImageUrl', blob, 'schema-image.jpg');
        }
      } else {
        // If image is optional, you can send an empty string or skip this line
        // formDataToSend.append('schemaImageUrl', '');
      }

      // DO NOT set Content-Type manually!
      const response = await fetch(`http://localhost:3000/api/dynamicTableInfo/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      console.log("response ===>", response);
      if (!response.ok) {
        throw new Error('Failed to update database');
      }

      const result = await response.json();

      console.log("result ===>", result);
      return {
        id: result.id,
        name: result.databaseName,
        tables: result.dynamicTableIds || [],
        schemaContent: result.schemaContent,
        schemaImage: result.schemaImageUrl || null,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update database');
    }
  }
);

export const deleteDatabase = createAsyncThunk(
  'database/delete',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      const response = await fetch(`http://localhost:3000/api/dynamicTableInfo/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete database');
      }

      // Optionally, you can check the response JSON for success
      // const result = await response.json();
      // if (!result.success) throw new Error(result.message);

      return id; // Return the deleted database's id so you can remove it from state
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete database');
    }
  }
);

export const fetchDatabaseById = createAsyncThunk(
  'database/fetchById',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const response = await fetch(`http://localhost:3000/api/dynamicTableInfo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch database');
      const result = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch database');
    }
  }
);

const databaseSlice = createSlice({
  name: 'database',
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
      // Fetch Databases
      .addCase(fetchDatabases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatabases.fulfilled, (state, action) => {
        state.loading = false;
        state.databases = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDatabases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Database
      .addCase(createDatabase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDatabase.fulfilled, (state, action) => {
        state.loading = false;
        state.databases.push(action.payload);
      })
      .addCase(createDatabase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Database
      .addCase(updateDatabase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDatabase.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.databases.findIndex(db => db.id === action.payload.id);
        if (index !== -1) {
          state.databases[index] = action.payload;
        }
      })
      .addCase(updateDatabase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Database
      .addCase(deleteDatabase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDatabase.fulfilled, (state, action) => {
        state.loading = false;
        state.databases = state.databases.filter(db => db.id !== action.payload);
      })
      .addCase(deleteDatabase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = databaseSlice.actions;
export default databaseSlice.reducer; 