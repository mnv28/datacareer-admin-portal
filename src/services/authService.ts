import { LOGIN } from "../api/constApi";
import { apiInstance } from "../api/axiosApi";
import { ApiError } from "../types/auth";

interface LoginPayload {
    email: string;
    password: string;
}

export const LoginApi = async (payload: LoginPayload) => {
    try {
        const response = await apiInstance.post(LOGIN, payload);
        return response;
    } catch (error) {
        if (error.response) {
        
            throw {
                message: error.response.data?.message || 'Login failed',
                statusCode: error.response.status,
                error: error.response.data?.error
            } as ApiError;
        } else if (error.request) {
         
            throw {
                message: 'No response from server',
                statusCode: 500,
                error: 'Network Error'
            } as ApiError;
        } else {
          
            throw {
                message: 'An unexpected error occurred',
                statusCode: 500,
                error: error.message
            } as ApiError;
        }
    }
}; 