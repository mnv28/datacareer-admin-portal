import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginApi } from "../../services/authService";
import { apiInstance } from "../../api/axiosApi";
import { User, LoginResponse, ApiError } from "../../types/auth";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

const initialState: AuthState = {
    user: (() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || storedUser === 'undefined' || storedUser === 'null') return null;
        try {
            return JSON.parse(storedUser);
        } catch (e) {
            return null;
        }
    })(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {

            const response = await LoginApi(credentials);

            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            console.error("Login API error:", error);
            const apiError = error as ApiError;
            return rejectWithValue(apiError.message);
        }
    }
);

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiInstance.get('/api/auth/me');
            return response.data.user || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                console.log("Login pending...");
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                if (action.payload.user) {
                    localStorage.setItem('user', JSON.stringify(action.payload.user));
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch user';
                if (action.payload?.includes('Unauthorized')) {
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 