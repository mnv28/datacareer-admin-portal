import { apiInstance } from "../api/axiosApi";
import { ApiError } from "../types/auth";

export interface SystemSettings {
    allowUserRegistration: boolean;
    allowQuestionSubmissions: boolean;
}

export interface SettingsResponse {
    settings: SystemSettings;
}

export const getSettings = async (): Promise<SystemSettings> => {
    try {
        const response = await apiInstance.get<any>('/api/admin/settings');
        // Handle common response formats: response.data.data, response.data.settings, or response.data directly
        return response.data.data || response.data.settings || response.data;
    } catch (error: any) {
        return handleApiError(error);
    }
};

export const updateSettings = async (settings: SystemSettings): Promise<SystemSettings> => {
    try {
        const response = await apiInstance.put<any>('/api/admin/settings', settings);
        // Handle common response formats: response.data.data, response.data.settings, or response.data directly
        return response.data.data || response.data.settings || response.data;
    } catch (error: any) {
        return handleApiError(error);
    }
};

export interface AdminAccountSettings {
    name: string;
    email: string;
    newPassword?: string;
}

export const updateAdminAccountSettings = async (settings: AdminAccountSettings): Promise<any> => {
    try {
        const response = await apiInstance.patch<any>('/api/auth/admin/account-settings', settings);
        return response.data.data || response.data;
    } catch (error: any) {
        return handleApiError(error);
    }
};

export const getAdminProfile = async (): Promise<any> => {
    try {
        const response = await apiInstance.get<any>('/api/auth/me');
        return response.data.user || response.data;
    } catch (error: any) {
        return handleApiError(error);
    }
};

const handleApiError = (error: any) => {
    if (error.response) {
        throw {
            message: error.response.data?.message || 'Operation failed',
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
};
