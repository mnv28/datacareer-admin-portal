
import React from 'react';
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

// Dummy data for charts
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

const Dashboard = () => {
  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of platform statistics and recent activities"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Companies"
          value="35"
          icon={<Building2 size={24} className="text-primary" />}
          change={{ value: "12%", positive: true }}
        />
        <StatsCard
          title="Total Questions"
          value="90"
          icon={<FileQuestion size={24} className="text-primary-light" />}
          change={{ value: "8%", positive: true }}
        />
        <StatsCard
          title="Registered Users"
          value="1,245"
          icon={<Users size={24} className="text-primary-accent" />}
          change={{ value: "24%", positive: true }}
        />
        <StatsCard
          title="Total Submissions"
          value="3,782"
          icon={<FileCheck size={24} className="text-primary-lightest" />}
          change={{ value: "5%", positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="data-card">
          <h2 className="text-lg font-semibold mb-4">Questions by Difficulty</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={difficultyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 25,
                }}
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
        </div>
        
        <div className="data-card">
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
        </div>
      </div>
      
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
