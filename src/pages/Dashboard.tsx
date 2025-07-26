import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatsCard from '@/components/ui/StatsCard';
import PageHeader from '@/components/ui/PageHeader';
import { Building2, FileQuestion, Users, FileCheck } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useDispatch, useSelector } from "react-redux";
import { fetchSummaryCounts } from "@/redux/Slices/summarySlice";
import type { RootState, AppDispatch } from "@/redux/store";
import flowimage from "../../public/Datacareer Admin User Guide.png"
import { Button } from '@/components/ui/button';
import { Download, Calendar, ListChecks } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { apiInstance } from "@/api/axiosApi"; // import at the top

// Dummy data for charts (keeping for fallback)
const difficultyData = [
  { name: 'Beginner', count: 45, fill: '#7692FF' },
  { name: 'Intermediate', count: 30, fill: '#3D518C' },
  { name: 'Advanced', count: 15, fill: '#E9724C' },
];

const questionTypeData = [
  { name: 'MySQL', value: 55 },
  { name: 'PostgreSQL', value: 35 },
  { name: 'Both', value: 10 },
];

const COLORS = ['#7692FF', '#3D518C', '#E9724C', '#ABD3FA'];

const recentSubmissions = [
  { id: 1, user: 'john.doe@example.com', question: 'SQL Joins Mastery', score: '85%', date: '2023-05-09', status: 'passed' },
  { id: 2, user: 'sarah.parker@gmail.com', question: 'Advanced PostgreSQL Functions', score: '72%', date: '2023-05-09', status: 'passed' },
  { id: 3, user: 'mike.wilson@outlook.com', question: 'Twitter Database Design', score: '45%', date: '2023-05-08', status: 'failed' },
  { id: 4, user: 'anna.johnson@company.co', question: 'Airbnb Booking Analysis', score: '92%', date: '2023-05-08', status: 'passed' },
  { id: 5, user: 'carlos.mendez@tech.edu', question: 'Instagram User Analytics', score: '68%', date: '2023-05-07', status: 'passed' },
];

// Dummy user tier data
const userTierData = [
  { name: 'Free', value: 120 },
  { name: 'Pro', value: 30 },
];

// Dummy active user data (keeping for fallback)
const activeUserData = [
  { date: '2024-05-01', active: 10 },
  { date: '2024-05-02', active: 12 },
  { date: '2024-05-03', active: 15 },
  { date: '2024-05-04', active: 9 },
  { date: '2024-05-05', active: 14 },
  { date: '2024-05-06', active: 11 },
  { date: '2024-05-07', active: 13 },
];

const dateRanges = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'All', value: 'all' },
];

const groupedFields = [
  {
    group: 'User Summary',
    value: 'userSummary',
    fields: [
      { label: 'Number of Registered Users', value: 'registeredUsers' },
      { label: 'Number of Active Users', value: 'activeUsers' },
      { label: 'Average Active Period', value: 'avgActivePeriod' },
      { label: 'Breakdown of Users by Tier (Free/Pro)', value: 'userTier' },
    ],
  },
  {
    group: 'Questions Database',
    value: 'questionsDatabase',
    fields: [
      { label: 'Number of Submissions', value: 'totalSubmissions' },
      { label: 'Number of Questions', value: 'totalQuestions' },
      { label: 'Breakdown of Questions by Difficulty', value: 'questionsByDifficulty' },
      { label: 'Breakdown of Questions by Company', value: 'questionsByCompany' },
      { label: 'Breakdown of Submissions by Success / Mismatch', value: 'submissionsBySuccess' },
      { label: 'Breakdown of Submissions by Difficulty', value: 'submissionsByDifficulty' },
      { label: 'Breakdown of Submissions by Company', value: 'submissionsByCompany' },
    ],
  },
];

function getAllFieldValues() {
  return groupedFields.flatMap(g => g.fields.map(f => f.value));
}

function getGroupFieldValues(groupValue) {
  const group = groupedFields.find(g => g.value === groupValue);
  return group ? group.fields.map(f => f.value) : [];
}

// Replace the dummy exportToCSV with a real API call
async function exportToCSV(selectedFields, dateRange) {
  // Map frontend field values to API field names
  const fieldMap = {
    registeredUsers: "numberOfRegisteredUsers",
    activeUsers: "numberOfActiveUsers",
    avgActivePeriod: "averageActivePeriod",
    userTier: "breakdownOfUsersByTier",
    totalSubmissions: "numberOfSubmissions",
    totalQuestions: "numberOfQuestions",
    questionsByDifficulty: "breakdownOfQuestionsByDifficulty",
    questionsByCompany: "breakdownOfQuestionsByCompany",
    submissionsBySuccess: "breakdownOfSubmissionsBySuccessMismatch",
    submissionsByDifficulty: "breakdownOfSubmissionsByDifficulty",
    submissionsByCompany: "breakdownOfSubmissionsByCompany",
  };

  // Build query params
  const params = new URLSearchParams();
  params.append("dateRange", dateRange === "7d" ? "7" : dateRange === "30d" ? "30" : "all");
  selectedFields.forEach(field => {
    if (fieldMap[field]) {
      params.append("fields", fieldMap[field]);
    }
  });

  try {
    const response = await apiInstance.get(
      `/api/export/admin/filterCSV?${params.toString()}`,
      { responseType: "blob" }
    );

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_export_${dateRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert("Export failed: " + (error?.message || "Unknown error"));
  }
}

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const summary = useSelector((state: RootState) => state.summary);

  // Export controls state
  const [dateRange, setDateRange] = useState('7d');
  const [selectedFields, setSelectedFields] = useState(getAllFieldValues());
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Preview table state
  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  // Difficulty chart state
  const [difficultyChartData, setDifficultyChartData] = useState([]);
  const [difficultyChartLoading, setDifficultyChartLoading] = useState(false);
  const [difficultyChartError, setDifficultyChartError] = useState('');

  // Active users chart state
  const [activeUsersChartData, setActiveUsersChartData] = useState([]);
  const [activeUsersChartLoading, setActiveUsersChartLoading] = useState(false);
  const [activeUsersChartError, setActiveUsersChartError] = useState('');

  // Group/parent checkbox logic
  const isGroupChecked = (groupValue) => {
    const groupFields = getGroupFieldValues(groupValue);
    return groupFields.every(f => selectedFields.includes(f));
  };
  const isGroupIndeterminate = (groupValue) => {
    const groupFields = getGroupFieldValues(groupValue);
    const checkedCount = groupFields.filter(f => selectedFields.includes(f)).length;
    return checkedCount > 0 && checkedCount < groupFields.length;
  };
  const handleGroupToggle = (groupValue) => {
    const groupFields = getGroupFieldValues(groupValue);
    if (isGroupChecked(groupValue)) {
      setSelectedFields(selectedFields.filter(f => !groupFields.includes(f)));
    } else {
      setSelectedFields(Array.from(new Set([...selectedFields, ...groupFields])));
    }
  };
  const handleFieldToggle = (fieldValue) => {
    setSelectedFields(selectedFields.includes(fieldValue)
      ? selectedFields.filter(f => f !== fieldValue)
      : [...selectedFields, fieldValue]);
  };
  // Show summary of selected fields
  const selectedLabels = groupedFields.flatMap(g => g.fields.filter(f => selectedFields.includes(f.value)).map(f => f.label));
  const summaryText = selectedLabels.length === getAllFieldValues().length
    ? 'All Fields'
    : selectedLabels.length === 0
    ? 'No Fields'
    : selectedLabels.slice(0, 2).join(', ') + (selectedLabels.length > 2 ? ` +${selectedLabels.length - 2} more` : '');

  useEffect(() => {
    dispatch(fetchSummaryCounts());
  }, [dispatch]);

  // Fetch difficulty chart data
  useEffect(() => {
    const fetchDifficultyChart = async () => {
      setDifficultyChartLoading(true);
      setDifficultyChartError('');
      try {
        const response = await apiInstance.get('/api/question/chart/difficulty');
        
        // Map API data to chart format
        const colorMap = {
          beginner: '#7692FF',
          intermediate: '#3D518C',
          advanced: '#E9724C',
        };
        
        const chartData = response.data.data.map(item => ({
          name: item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1),
          count: item.count,
          fill: colorMap[item.difficulty] || '#ABD3FA',
        }));
        
        setDifficultyChartData(chartData);
      } catch (err) {
        setDifficultyChartError('Failed to load difficulty chart');
        setDifficultyChartData([]);
      } finally {
        setDifficultyChartLoading(false);
      }
    };
    
    fetchDifficultyChart();
  }, []);

  // Fetch active users chart data
  useEffect(() => {
    const fetchActiveUsersChart = async () => {
      setActiveUsersChartLoading(true);
      setActiveUsersChartError('');
      try {
        const response = await apiInstance.get('/api/auth/admin/chart/active-users');
        
        // Map API data to chart format
        const chartData = response.data.data.map(item => ({
          date: item.date,
          active: item.activeUsers,
        }));
        
        setActiveUsersChartData(chartData);
      } catch (err) {
        setActiveUsersChartError('Failed to load active users chart');
        setActiveUsersChartData([]);
      } finally {
        setActiveUsersChartLoading(false);
      }
    };
    
    fetchActiveUsersChart();
  }, []);

  // Fetch preview data when fields or dateRange change
  useEffect(() => {
    const fetchPreview = async () => {
      setPreviewLoading(true);
      setPreviewError('');
      try {
        // Map frontend field values to API field names
        const fieldMap = {
          registeredUsers: "numberOfRegisteredUsers",
          activeUsers: "numberOfActiveUsers",
          avgActivePeriod: "averageActivePeriod",
          userTier: "breakdownOfUsersByTier",
          totalSubmissions: "numberOfSubmissions",
          totalQuestions: "numberOfQuestions",
          questionsByDifficulty: "breakdownOfQuestionsByDifficulty",
          questionsByCompany: "breakdownOfQuestionsByCompany",
          submissionsBySuccess: "breakdownOfSubmissionsBySuccessMismatch",
          submissionsByDifficulty: "breakdownOfSubmissionsByDifficulty",
          submissionsByCompany: "breakdownOfSubmissionsByCompany",
        };
        const params = new URLSearchParams();
        params.append("dateRange", dateRange === "7d" ? "7" : dateRange === "30d" ? "30" : "all");
        selectedFields.forEach(field => {
          if (fieldMap[field]) {
            params.append("fields", fieldMap[field]);
          }
        });
        const response = await apiInstance.get(`/api/export/admin/previewCSV?${params.toString()}`);
        setPreviewData(response.data);
      } catch (err) {
        setPreviewError('Failed to load preview');
        setPreviewData([]);
      } finally {
        setPreviewLoading(false);
      }
    };
    fetchPreview();
  }, [selectedFields, dateRange]);

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of platform statistics and recent activities"
        actions={
          <div className="flex gap-2 items-center">
            {/* Date Range Dropdown */}
            <select
              className="border rounded px-2 py-1 text-sm"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              {dateRanges.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {/* Grouped Field Selection Popover */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[160px] flex justify-between items-center px-3 py-1 text-sm border"
                >
                  <span className="truncate text-left">{summaryText}</span>
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.84a.75.75 0 01-1.02 0l-4.25-3.84a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-2">
                {groupedFields.map(group => {
                  const groupRef = useRef(null);
                  useEffect(() => {
                    if (groupRef.current) {
                      groupRef.current.indeterminate = isGroupIndeterminate(group.value);
                    }
                  }, [selectedFields, group.value]);
                  return (
                    <div key={group.value} className="mb-2">
                      <div className="flex items-center mb-1">
                        <Checkbox
                          checked={isGroupChecked(group.value)}
                          onCheckedChange={() => handleGroupToggle(group.value)}
                          id={`group-${group.value}`}
                          ref={groupRef}
                        />
                        <label htmlFor={`group-${group.value}`} className="ml-2 font-semibold text-sm cursor-pointer">
                          {group.group}
                        </label>
                      </div>
                      <div className="pl-6 space-y-1">
                        {group.fields.map(field => (
                          <div key={field.value} className="flex items-center">
                            <Checkbox
                              checked={selectedFields.includes(field.value)}
                              onCheckedChange={() => handleFieldToggle(field.value)}
                              id={`field-${field.value}`}
                            />
                            <label htmlFor={`field-${field.value}`} className="ml-2 text-sm cursor-pointer">
                              {field.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
            {/* Export Button */}
            <Button
              size="sm"
              className="flex items-center gap-1"
              onClick={() => exportToCSV(selectedFields, dateRange)}
            >
              <Download size={16} /> Export CSV
            </Button>
          </div>
        }
      />

      
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Companies"
          value={summary?.loading ? "Loading..." : summary?.counts?.totalCompanies?.toString() || "0"}
          icon={<Building2 size={24} className="text-primary" />}
          change={{ value: "12%", positive: true }}
        />
        <StatsCard
          title="Total Questions"
          value={summary?.loading ? "Loading..." : summary?.counts?.totalQuestions?.toString() || "0"}
          icon={<FileQuestion size={24} className="text-primary-light" />}
          change={{ value: "8%", positive: true }}
        />
        <StatsCard
          title="Registered Users"
          value={summary?.loading ? "Loading..." : summary?.counts?.totalUsers?.toString() || "0"}
          icon={<Users size={24} className="text-primary-accent" />}
          change={{ value: "24%", positive: true }}
        />
        <StatsCard
          title="Total Submissions"
          value={summary?.loading ? "Loading..." : summary?.counts?.totalSubmissions?.toString() || "0"}
          icon={<FileCheck size={24} className="text-primary-lightest" />}
          change={{ value: "5%", positive: true }}
        />
      </div>


    {/* Preview Table */}
    <div className="data-card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Preview</h2>
        </div>
        {previewLoading ? (
          <div className="py-8 text-center text-gray-500">Loading preview...</div>
        ) : previewError ? (
          <div className="py-8 text-center text-red-500">{previewError}</div>
        ) : previewData && previewData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Date Range</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap">{row.category}</td>
                    <td>{row.metric}</td>
                    <td>{row.value}</td>
                    <td>{row.dateRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400">No data to display.</div>
        )}
      </div>
     
      
      {/* User Tier Breakdown Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">User Tier Breakdown</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userTierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}
           <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Questions by Difficulty</h2>
          <div className="h-80 flex items-center justify-center">
            {difficultyChartLoading ? (
              <div className="text-gray-500">Loading chart...</div>
            ) : difficultyChartError ? (
              <div className="text-red-500">{difficultyChartError}</div>
            ) : difficultyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={difficultyChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {difficultyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400">No data available</div>
            )}
          </div>
        </div>
        {/* Active Users Over Time Chart */}
        <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Active Users (Last 7 Days)</h2>
          <div className="h-80 flex items-center justify-center">
            {activeUsersChartLoading ? (
              <div className="text-gray-500">Loading chart...</div>
            ) : activeUsersChartError ? (
              <div className="text-red-500">{activeUsersChartError}</div>
            ) : activeUsersChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeUsersChartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="#7692FF" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>
      {/* Questions by Difficulty */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> */}
        {/* <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Questions by Difficulty</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={difficultyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count">
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}
        {/* Questions by Type (example) */}
        {/* <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Questions by Type</h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={questionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {questionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      {/* </div> */}
      {/* Add more breakdowns as needed (by company, submissions, etc.) */}
      
      <div className="data-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Submissions</h2>
          <a href="/submissions" className="text-sm text-primary-light hover:underline">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Question</th>
                <th>Score</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap">{submission.user}</td>
                  <td>{submission.question}</td>
                  <td>{submission.score}</td>
                  <td>{submission.date}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        submission.status === 'passed' ? 'status-badge-active' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
