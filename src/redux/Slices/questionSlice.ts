import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api/axiosApi";
import { AxiosError } from 'axios';

interface QuestionResponse {

  id: number;
  title: string;
  companyId: number;
  databaseName:string,
  topicName:string,
  companyname:string,
  company: {
    id: number;
    name: string;
  };
  topicId?: number;
  topic: {
    id: number;
    name: string;
  };
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
  dynamicTableInfo?: {
    databaseName: string;
    schemaContent: string;
    schemaImageUrl: string;
  };
  dynamicTableInfoId?: number;
  userId?: number | null;
}

export interface Question {
  id: number;
  title: string;
  companyId: number;
  company: {
    id: number;
    name: string;
  };
  topicId?: number;
  topic: {
    id: number;
    name: string;
  };
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
  dynamicTableInfoId?: string;
  dynamicTableInfo?: {
    databaseName: string;
    schemaContent: string;
    schemaImageUrl: string;
  };
  companyname?: string;
  topicName?: string;
  databaseName?: string;
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
  console.log("topicId question question" ,question);
  
  let solutionQuery = '';
  try {
    // Only parse if question.query is a non-empty string and looks like JSON
    if (typeof question.query === 'string' && question.query.startsWith('{') && question.query.endsWith('}')) {
       const queryData = JSON.parse(question.query);
       solutionQuery = queryData.solutionQuery || '';
    }
  } catch (e) {
    // If parsing fails, use empty string
    solutionQuery = '';
  }

  // Ensure company and topic are included as objects if they exist in the response
  const transformedQuestion: Question = {
    ...question, // Spread original properties (includes id, title, companyId, dbType, etc.)
    // Include flat properties from API response
    companyname: question.companyname,
    topicName: question.topicName,
    databaseName: question.databaseName,
    // Use topicId from the response
    topicId: question.topicId,
    solutionQuery: question.solutionQuery || solutionQuery,
    dynamicTableInfoId: question.dynamicTableInfoId?.toString() || '',
  };

  // Add console logs to inspect the transformed object just before returning
  console.log("Transformed Question:", transformedQuestion);
  console.log("Transformed Question Company:", transformedQuestion.company);
  console.log("Transformed Question Topic:", transformedQuestion.topic);

  return transformedQuestion;
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
      console.log("response =",response.data.data);
      
      
      // Transform the response data to match our Question interface
      const questions = (response.data.data || []).map(transformQuestion);
      
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

      // API response structure is likely { success: true, data: { ...new_question... } }
      // Access the new question from response.data.data
      const newQuestion = response.data.data; // <-- Access data property

      // Transform the new question object and return it
      return transformQuestion(newQuestion); // <-- Use the corrected object

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
        }
      });

      // Response structure is { success: true, data: { ...updated_question... } }
      // Access the updated question from response.data.data
      const updatedQuestion = response.data.data; // <-- Access data property

      // Transform the updated question object and return it
      return transformQuestion(updatedQuestion); // <-- Use the corrected object

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
        state.error = null;
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters } = questionSlice.actions;
export default questionSlice.reducer; 