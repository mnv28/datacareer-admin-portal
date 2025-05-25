import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api/axiosApi";
import { AxiosError } from 'axios';

interface QuestionResponse {
  id: number;
  title: string;
  companyId: number;
  topicId?: number;
  topic?: string;
  dbType: string;
  difficulty: string;
  status: string;
  questionContent: string;
  schemaContent: string;
  schemaImage: string | null;
  solution: string;
  query: string;
  solutionQuery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  title: string;
  companyId: number;
  topic: string;
  topicId?: number;
  dbType: string;
  type?: string;
  difficulty: string;
  status: string;
  questionContent: string;
  schemaContent: string;
  schemaImage: string | File | null;
  solution: string;
  query: string;
  createTableQuery?: string;
  addDataQuery?: string;
  solutionQuery?: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    companyId: string | null;
    dbType: string | null;
    status: string;
    difficulty: string | null;
  };
}

const initialState: QuestionState = {
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
};

const transformQuestion = (question: QuestionResponse): Question => {
  // Parse the query JSON to extract solutionQuery if it exists
  let solutionQuery = '';
  try {
    const queryData = JSON.parse(question.query);
    solutionQuery = queryData.solutionQuery || '';
  } catch (e) {
    // If parsing fails, use empty string
    solutionQuery = '';
  }

  return {
    ...question,
    topic: question.topic || '',
    topicId: question.topicId || (question.topic ? parseInt(question.topic) : 0),
    solutionQuery: question.solutionQuery || solutionQuery
  };
};

export const fetchQuestions = createAsyncThunk(
  'question/fetchAll',
  async (filters: {
    search?: string;
    companyId?: string | null;
    dbType?: string | null;
    status?: string;
    difficulty?: string | null;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.companyId) params.append('companyId', filters.companyId);
      if (filters.dbType) params.append('dbType', filters.dbType);
      if (filters.status) params.append('status', filters.status);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await apiInstance.get(`/api/question/admin/getAll?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Transform the response data to match our Question interface
      const questions = (response.data.questions || []).map(transformQuestion);
      
      return questions;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'question/create',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post('/api/question/admin/create', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      return transformQuestion(response.data.question);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'question/update',
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.put(`/api/question/admin/update/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      return transformQuestion(response.data.question);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update question');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'question/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiInstance.delete(`/api/question/admin/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete question');
    }
  }
);

const questionSlice = createSlice({
  name: 'question',
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
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex(question => question.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Question
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter(question => question.id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = questionSlice.actions;
export default questionSlice.reducer; 