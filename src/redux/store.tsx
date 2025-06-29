import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import summaryReducer from './Slices/summarySlice';
import domainReducer from './Slices/domainSlice';
import companyReducer from './Slices/companySlice';
import questionReducer from './Slices/questionSlice';
import topicReducer from './Slices/topicSlice';
import submissionReducer from './Slices/submissionSlice';
import userReducer from './Slices/userSlice';
import { User } from '../types/auth';
import { Company } from './Slices/companySlice';

// Define the root state type
export interface RootState {
    auth: {
        user: User | null;
        token: string | null;
        isAuthenticated: boolean;
        loading: boolean;
        error: string | null;
    };
    summary: {
        counts: {
            totalQuestions: number;
            totalCompanies: number;
            totalUsers: number;
            totalSubmissions: number;
        } | null;
        loading: boolean;
        error: string | null;
    };
    domain: {
        domains: Array<{
            id: number;
            name: string;
            description: string;
            status: string;
            createdAt: string;
            updatedAt: string;
        }>;
        loading: boolean;
        error: string | null;
        filters: {
            search: string;
            status: string;
        };
    };
    company: {
        companies: Company[];
        loading: boolean;
        error: string | null;
        filters: {
            search: string;
            status: string;
        };
    };
    question: {
        questions: Array<{
            id: number;
            title: string;
            companyId: number;
            company: string;
            topic: string;
            topicId?: number;
            dbType: string;
            difficulty: string;
            status: string;
            questionContent: string;
            schemaContent: string;
            schemaImage: string | null;
            solution: string;
            query: string;
            createdAt: string;
            updatedAt: string;
        }>;
        loading: boolean;
        error: string | null;
        filters: {
            search: string;
            companyId: string | null;
            dbType: string | null;
            status: string;
            difficulty: string | null;
        };
    };
    topic: {
        topics: Array<{
            id: number;
            name: string;
            questionCount: number;
            createdAt: string;
            updatedAt: string;
        }>;
        loading: boolean;
        error: string | null;
        filters: {
            search: string;
        };
    };
    submission: {
        submissions: Array<{
            id: number;
            user: string;
            question: string;
            dbType: string;
            status: string;
            dateTime: string;
        }>;
        loading: boolean;
        error: string | null;
        filters: {
            questionId: string;
            dbType: string;
            status: string;
            search: string;
        };
    };
    user: {
        users: Array<{
            id: number;
            name: string;
            email: string;
            totalAttempted: number;
            lastLogin: string | null;
            status: string;
        }>;
        loading: boolean;
        error: string | null;
        filters: {
            search: string;
            status: string;
        };
    };
}

export const store = configureStore({
    reducer: {
        auth: authReducer,
        summary: summaryReducer,
        domain: domainReducer,
        company: companyReducer,
        question: questionReducer,
        topic: topicReducer,
        submission: submissionReducer,
        user: userReducer,
    },
    preloadedState: {
        summary: {
            counts: null,
            loading: false,
            error: null
        },
        domain: {
            domains: [],
            loading: false,
            error: null,
            filters: {
                search: '',
                status: ''
            }
        },
        company: {
            companies: [],
            loading: false,
            error: null,
            filters: {
                search: '',
                status: ''
            }
        },
        question: {
            questions: [],
            loading: false,
            error: null,
            filters: {
                search: '',
                companyId: null,
                dbType: null,
                status: 'active',
                difficulty: null
            }
        },
        topic: {
            topics: [],
            loading: false,
            error: null,
            filters: {
                search: ''
            }
        },
        submission: {
            submissions: [],
            loading: false,
            error: null,
            filters: {
                questionId: '',
                dbType: '',
                status: '',
                search: ''
            }
        },
        user: {
            users: [],
            loading: false,
            error: null,
            filters: {
                search: '',
                status: ''
            }
        }
    }
});

export type AppDispatch = typeof store.dispatch; 