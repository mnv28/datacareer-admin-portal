import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import companyReducer from './Slices/companySlice';
import topicReducer from './Slices/topicSlice';
import questionReducer from './Slices/questionSlice';
import tableReducer from './Slices/tableSlice';
import databaseReducer from './Slices/databaseSlice';
import domainReducer from './Slices/domainSlice';
import submissionReducer from './Slices/submissionSlice';
import userReducer from './Slices/userSlice';
import summaryReducer from './Slices/summarySlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    topic: topicReducer,
    question: questionReducer,
    table: tableReducer,
    database: databaseReducer,
    domains: domainReducer,
    submissions: submissionReducer,
    users: userReducer,
    summary: summaryReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 