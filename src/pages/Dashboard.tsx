import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatsCard from '@/components/ui/StatsCard';
import PageHeader from '@/components/ui/PageHeader';
import { Users, Clock, Briefcase, FileQuestion, FileCheck } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Download, Calendar, ListChecks } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { apiInstance } from "@/api/axiosApi";

const COLORS = ['#7692FF', '#3D518C', '#E9724C', '#ABD3FA'];

const recentSubmissions = [
  { id: 1, user: 'john.doe@example.com', question: 'SQL Joins Mastery', score: '85%', date: '2023-05-09', status: 'passed' },
  { id: 2, user: 'sarah.parker@gmail.com', question: 'Advanced PostgreSQL Functions', score: '72%', date: '2023-05-09', status: 'passed' },
  { id: 3, user: 'mike.wilson@outlook.com', question: 'Twitter Database Design', score: '45%', date: '2023-05-08', status: 'failed' },
  { id: 4, user: 'anna.johnson@company.co', question: 'Airbnb Booking Analysis', score: '92%', date: '2023-05-08', status: 'passed' },
  { id: 5, user: 'carlos.mendez@tech.edu', question: 'Instagram User Analytics', score: '68%', date: '2023-05-07', status: 'passed' },
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
      { label: 'Breakdown of Users by Tier (On Trial/Pro)', value: 'userTier' },
      { label: 'Number of Pro Users with Coupon', value: 'proUsersWithCoupon' },
    ],
  },
  {
    group: 'Questions Database',
    value: 'questionsDatabase',
    fields: [
      { label: 'Number of Submissions', value: 'totalSubmissions' },
      { label: 'Number of Saved Jobs', value: 'savedJobs' },
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

// Export function that sends both date range and selected fields
async function exportToCSV(selectedFields, dateRange) {
  // Map frontend field values to API field names
  const fieldMap = {
    registeredUsers: "numberOfRegisteredUsers",
    activeUsers: "numberOfActiveUsers",
    avgActivePeriod: "averageActivePeriod",
    userTier: "breakdownOfUsersByTier",
    proUsersWithCoupon: "numberOfProUsersWithCoupon",
    totalSubmissions: "numberOfSubmissions",
    savedJobs: "numberOfSavedJobs",
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
  const [dateRange, setDateRange] = useState('all');
  const [selectedFields, setSelectedFields] = useState(getAllFieldValues());
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

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

  // Build dashboard data with query parameters
  const buildDashboardData = async (dateRange) => {
    setDashboardLoading(true);
    setDashboardError('');
    try {
      // Build query params - only send dateRange
      const params = new URLSearchParams();
      params.append("dateRange", dateRange === "7d" ? "7" : dateRange === "30d" ? "30" : "all");

      const response = await apiInstance.get(`/api/export/admin/dashboardDisplay?${params.toString()}`);
      setDashboardData(response.data);
    } catch (err) {
      setDashboardError('Failed to load dashboard data');
      setDashboardData([]);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Fetch dashboard data from single API endpoint
  useEffect(() => {
    buildDashboardData(dateRange);
  }, [dateRange]);

  // Helper functions to extract data from API response
  const getMetricValue = (metricName) => {
    const item = dashboardData.find(item => item.metric === metricName);
    return item ? item.value : 0;
  };

  const getQuestionsByDifficultyData = () => {
    const data = [];
    const beginner = getMetricValue('Questions by Difficulty - beginner');
    const intermediate = getMetricValue('Questions by Difficulty - intermediate');
    const advanced = getMetricValue('Questions by Difficulty - advanced');

    if (beginner > 0) data.push({ name: 'Beginner', count: beginner, fill: '#7692FF' });
    if (intermediate > 0) data.push({ name: 'Intermediate', count: intermediate, fill: '#3D518C' });
    if (advanced > 0) data.push({ name: 'Advanced', count: advanced, fill: '#E9724C' });

    return data;
  };

  const getSubmissionsByDifficultyData = () => {
    const data = [];
    const beginner = getMetricValue('Submissions by Difficulty - beginner');
    const intermediate = getMetricValue('Submissions by Difficulty - intermediate');

    if (beginner > 0) data.push({ name: 'Beginner', count: beginner, fill: '#7692FF' });
    if (intermediate > 0) data.push({ name: 'Intermediate', count: intermediate, fill: '#3D518C' });

    return data;
  };

  const getQuestionsByCompanyData = () => {
    const data = [];
    dashboardData.forEach(item => {
      if (item.metric.startsWith('Questions by Company - ')) {
        const companyName = item.metric.replace('Questions by Company - ', '');
        data.push({ name: companyName, count: item.value, fill: '#7692FF' });
      }
    });
    return data;
  };

  const getSubmissionsByStatusData = () => {
    const data = [];
    const passed = getMetricValue('Submissions by Status - passed');
    const error = getMetricValue('Submissions by Status - error');
    const mismatch = getMetricValue('Submissions by Status - mismatch');

    if (passed > 0) data.push({ name: 'Passed', count: passed, fill: '#7692FF' });
    if (error > 0) data.push({ name: 'Error', count: error, fill: '#E9724C' });
    if (mismatch > 0) data.push({ name: 'Mismatch', count: mismatch, fill: '#ABD3FA' });

    return data;
  };

  const getUserTierData = () => {
    const trial = getMetricValue('Users by Tier - trial') || getMetricValue('Users by Tier - free');
    const totalPro = getMetricValue('Users by Tier - pro');
    const proCoupon = getUsersWithCouponCode(); // Use the same flexible search as the card
    const proWithoutCoupon = totalPro - proCoupon; // Subtract coupon users from total Pro

    const data = [];
    if (trial > 0) data.push({ name: 'On Trial', value: trial, fill: '#7692FF' });
    if (proWithoutCoupon > 0) data.push({ name: 'Pro', value: proWithoutCoupon, fill: '#3D518C' });
    if (proCoupon > 0) data.push({ name: 'Pro (Coupon)', value: proCoupon, fill: '#E9724C' });

    return data;
  };

  // Helper functions for user tier cards
  const getUsersWithCouponCode = () => {
    // Try multiple possible metric names
    const directMetrics = [
      'Users with Coupon Code',
      'Users with Promo Code',
      'Number of users purchased through coupon code',
      'Coupon Code Users',
      'Promo Code Users',
      'Users by Coupon Code',
      'Users by Promo Code',
      'Users with Coupon/Promo Code',
      'Number of Users with Coupon/Promo Code'
    ];

    for (const metric of directMetrics) {
      const value = getMetricValue(metric);
      if (value > 0) return value;
    }

    // Search through all dashboard data for any metric containing "coupon" or "promo"
    const couponMetric = dashboardData.find(item =>
      item.metric && (
        item.metric.toLowerCase().includes('coupon') ||
        item.metric.toLowerCase().includes('promo')
      )
    );

    return couponMetric ? couponMetric.value : 0;
  };

  const getPaidUsers = () => {
    return getMetricValue('Users by Tier - pro') || 0;
  };

  const getOnTrialUsers = () => {
    return getMetricValue('Users by Tier - trial') || getMetricValue('Users by Tier - free') || 0;
  };

  const getSubmissionsByCompanyData = () => {
    const data = [];
    dashboardData.forEach(item => {
      if (item.metric.startsWith('Submissions by Company - ')) {
        const companyName = item.metric.replace('Submissions by Company - ', '');
        data.push({ name: companyName, count: item.value, fill: '#7692FF' });
      }
    });
    return data;
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatsCard
          title="Registered Users"
          value={dashboardLoading ? "Loading..." : getMetricValue('Number of Registered Users').toString()}
          icon={<Users size={24} className="text-primary-accent" />}
          change={{ value: "24%", positive: true }}
        />
        <StatsCard
          title="Active Users"
          value={dashboardLoading ? "Loading..." : getMetricValue('Number of Active Users').toString()}
          icon={<Users size={24} className="text-primary-accent" />}
          change={{ value: "24%", positive: true }}
        />
        <StatsCard
          title="Average Active Period"
          value={dashboardLoading ? "Loading..." : getMetricValue('Average Active Period (Days)').toString()}
          icon={<Clock size={24} className="text-primary-accent" />}
          change={{ value: "8%", positive: true }}
        />
        <StatsCard
          title="Number of Jobs (Last 7 Days)"
          value={dashboardLoading ? "Loading..." : "0"}
          icon={<Briefcase size={24} className="text-primary-accent" />}
          change={{ value: "5%", positive: true }}
        />
        <StatsCard
          title="Number of Jobs (Last 30 Days)"
          value={dashboardLoading ? "Loading..." : "0"}
          icon={<Briefcase size={24} className="text-primary-accent" />}
          change={{ value: "5%", positive: true }}
        />
        <StatsCard
          title="Number of Saved Jobs"
          value={dashboardLoading ? "Loading..." : getMetricValue('Number of Saved Jobs').toString()}
          icon={<Briefcase size={24} className="text-primary-accent" />}
        />
      </div>

      {/* Users by Tier Chart */}
      <div className="data-card mb-8">
        <h2 className="text-lg font-semibold mb-4">Users by Tier (On Trial/Pro)</h2>
        <div className="h-80 flex items-center justify-center">
          {dashboardLoading ? (
            <div className="text-gray-500">Loading chart...</div>
          ) : dashboardError ? (
            <div className="text-red-500">{dashboardError}</div>
          ) : getUserTierData().length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getUserTierData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {getUserTierData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* User Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="No. of users purchased through coupon code"
          value={dashboardLoading ? "Loading..." : getUsersWithCouponCode().toString()}
          icon={<Users size={24} className="text-primary-accent" />}
        />
        <StatsCard
          title="Number of Paid Users"
          value={dashboardLoading ? "Loading..." : getPaidUsers().toString()}
          icon={<Users size={24} className="text-primary-accent" />}
        />
        <StatsCard
          title="On Trial"
          value={dashboardLoading ? "Loading..." : getOnTrialUsers().toString()}
          icon={<Users size={24} className="text-primary-accent" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="Number of Questions"
          value={dashboardLoading ? "Loading..." : getMetricValue('Number of Questions').toString()}
          icon={<FileQuestion size={24} className="text-primary-accent" />}
          change={{ value: "8%", positive: true }}
        />
        <StatsCard
          title="Number of Submissions"
          value={dashboardLoading ? "Loading..." : getMetricValue('Number of Submissions').toString()}
          icon={<FileCheck size={24} className="text-primary-accent" />}
          change={{ value: "5%", positive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Questions by Difficulty */}
        <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Questions by Difficulty</h2>
          <div className="h-80 flex items-center justify-center">
            {dashboardLoading ? (
              <div className="text-gray-500">Loading chart...</div>
            ) : dashboardError ? (
              <div className="text-red-500">{dashboardError}</div>
            ) : getQuestionsByDifficultyData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getQuestionsByDifficultyData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {getQuestionsByDifficultyData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Submissions by Difficulty */}
        <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Submissions by Difficulty</h2>
          <div className="h-80 flex items-center justify-center">
            {dashboardLoading ? (
              <div className="text-gray-500">Loading chart...</div>
            ) : dashboardError ? (
              <div className="text-red-500">{dashboardError}</div>
            ) : getSubmissionsByDifficultyData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getSubmissionsByDifficultyData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {getSubmissionsByDifficultyData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Questions by Company */}
        <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Questions by Company</h2>
          <div className="h-80 flex items-center justify-center">
            {dashboardLoading ? (
              <div className="text-gray-500">Loading chart...</div>
            ) : dashboardError ? (
              <div className="text-red-500">{dashboardError}</div>
            ) : getQuestionsByCompanyData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getQuestionsByCompanyData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {getQuestionsByCompanyData().map((entry, index) => (
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

        {/* Submissions by Status */}
        <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Submissions by Status</h2>
          <div className="h-80 flex items-center justify-center">
            {dashboardLoading ? (
              <div className="text-gray-500">Loading chart...</div>
            ) : dashboardError ? (
              <div className="text-red-500">{dashboardError}</div>
            ) : getSubmissionsByStatusData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getSubmissionsByStatusData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {getSubmissionsByStatusData().map((entry, index) => (
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
      </div>

      {/* <div className="data-card">
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
                      className={`status-badge ${submission.status === 'passed' ? 'status-badge-active' : 'bg-red-100 text-red-800'
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
      </div> */}
    </AdminLayout>
  );
};

export default Dashboard;
