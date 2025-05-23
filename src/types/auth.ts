export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
} 