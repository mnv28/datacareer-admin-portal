import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "@/api/axiosApi";

export interface Table {
  id: number;
  name: string;
  query: string;
  insertData: string;
  createdAt: string;
  updatedAt: string;
}

// Static data for testing
const staticTables: Table[] = [
  {
    id: 1,
    name: "Users Table",
    query: "CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100),\n  created_at TIMESTAMP\n);",
    insertData: "INSERT INTO users (id, name, email, created_at) VALUES\n(1, 'John Doe', 'john@example.com', '2024-01-01'),\n(2, 'Jane Smith', 'jane@example.com', '2024-01-02');",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Products Table",
    query: "CREATE TABLE products (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  price DECIMAL(10,2),\n  stock INT\n);",
    insertData: "INSERT INTO products (id, name, price, stock) VALUES\n(1, 'Laptop', 999.99, 50),\n(2, 'Smartphone', 499.99, 100);",
    createdAt: "2024-03-15T11:00:00Z",
    updatedAt: "2024-03-15T11:00:00Z"
  },
  {
    id: 3,
    name: "Orders Table",
    query: "CREATE TABLE orders (\n  id INT PRIMARY KEY,\n  user_id INT,\n  total_amount DECIMAL(10,2),\n  order_date TIMESTAMP,\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);",
    insertData: "INSERT INTO orders (id, user_id, total_amount, order_date) VALUES\n(1, 1, 1499.98, '2024-03-15'),\n(2, 2, 499.99, '2024-03-15');",
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z"
  }
];

interface TableState {
  tables: Table[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
  };
}

const initialState: TableState = {
  tables: staticTables,
  loading: false,
  error: null,
  filters: {
    search: ''
  }
};

// export const fetchTables = createAsyncThunk(
//   'table/fetchAll',
//   async (filters: { search?: string }, { rejectWithValue }) => {
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       let filteredTables = [...staticTables];
//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase();
//         filteredTables = filteredTables.filter(table => 
//           table.name.toLowerCase().includes(searchLower) ||
//           table.query.toLowerCase().includes(searchLower)
//         );
//       }
//       return filteredTables;
//     } catch (error) {
//       return rejectWithValue('Failed to fetch tables');
//     }
//   }
// );

export const createTable = createAsyncThunk(
  'tables/createTable',
  async (formData: { name: string; query: string; insertData: string }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      // Log the request payload
      console.log('Creating table with data:', {
        tableName: formData.name,
        createTableQuery: formData.query,
        insertDataQuery: formData.insertData || ''
      });

      const response = await apiInstance.post(
        '/api/dynamicTable',
        {
          tableName: formData.name,
          createTableQuery: formData.query,
          insertDataQuery: formData.insertData || ''
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the response
      console.log('Server response:', response.data);

      // If backend returns success: false, treat as error
      if (response.data && response.data.success === false) {
        console.error('Backend error:', response.data);
        return rejectWithValue(response.data.message || 'Failed to create table');
      }

      // Return the created table data
      return {
        id: response.data.id,
        name: formData.name,
        query: formData.query,
        insertData: formData.insertData || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error: any) {
      // Log the full error
      console.error('Error creating table:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return a more detailed error message
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Failed to create table'
      );
    }
  }
);

export const updateTable = createAsyncThunk(
  'table/update',
  async ({ id, data }: { id: number; data: Partial<Table> }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      // Log the request payload
      console.log('Updating table with data:', {
        id,
        tableName: data.name,
        createTableQuery: data.query,
        insertDataQuery: data.insertData || ''
      });

      const response = await apiInstance.put(
        `/api/dynamicTable/${id}`,
        {
          tableName: data.name,
          createTableQuery: data.query,
          insertDataQuery: data.insertData || ''
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the response
      console.log('Server response:', response.data);

      // If backend returns success: false, treat as error
      if (response.data && response.data.success === false) {
        console.error('Backend error:', response.data);
        return rejectWithValue(response.data.message || 'Failed to update table');
      }

      return response.data;
    } catch (error: any) {
      // Log the full error
      console.error('Error updating table:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return a more detailed error message
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Failed to update table'
      );
    }
  }
);

export const deleteTable = createAsyncThunk(
  'table/delete',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      // Get token from auth state (adjust as needed)
      const state: any = getState();
      const token = state.auth?.token; // or wherever you store your JWT

      await apiInstance.delete(`/api/dynamicTable/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return id; // Return the deleted table's id so you can remove it from state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete table');
    }
  }
);

export const fetchDynamicTables = createAsyncThunk(
  'table/fetchDynamicTables',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;

      const response = await apiInstance.get('/api/dynamicTable', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dynamic tables');
    }
  }
);

const tableSlice = createSlice({
  name: 'table',
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

      // Create Table
      .addCase(createTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables.push(action.payload);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Table
      .addCase(updateTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Table
      .addCase(deleteTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = state.tables.filter(table => table.id !== action.payload);
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Dynamic Tables
      .addCase(fetchDynamicTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDynamicTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = Array.isArray(action.payload)
          ? action.payload.map((t: any) => ({
              id: t.id,
              name: t.tableName,
              query: t.createTableQuery,
              insertData: t.insertDataQuery,
              createdAt: t.createdAt,
              updatedAt: t.updatedAt,
              status: t.status,
            }))
          : [];
      })
      .addCase(fetchDynamicTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = tableSlice.actions;
export default tableSlice.reducer; 