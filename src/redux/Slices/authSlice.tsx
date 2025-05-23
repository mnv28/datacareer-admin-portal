import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginApi } from "../../services/authService";
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
    user: null,
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
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
                console.log("Login fulfilled:", action.payload);
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log("Login rejected:", action.payload);
                state.loading = false;
                state.error = action.payload || 'Login failed';
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 