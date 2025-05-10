
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import SearchFilter from '@/components/ui/SearchFilter';
import StatusBadge from '@/components/ui/StatusBadge';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Dummy data for submissions
const initialSubmissions = [
  {
    id: 1,
    user: 'john.doe@example.com',
    question: 'Advanced SQL Joins',
    dbType: 'MySQL',
    query: 'SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE orders.status = "completed"',
    result: 'Query successful. 15 rows returned.',
    status: 'passed',
    score: 85,
    dateTime: '2023-05-09 14:32:15',
  },
  {
    id: 2,
    user: 'sarah.parker@gmail.com',
    question: 'Window Functions',
    dbType: 'PostgreSQL',
    query: 'SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) FROM employees',
    result: 'Query successful. 42 rows returned.',
    status: 'passed',
    score: 92,
    dateTime: '2023-05-09 10:15:27',
  },
  {
    id: 3,
    user: 'mike.wilson@outlook.com',
    question: 'Recursive CTEs',
    dbType: 'PostgreSQL',
    query: 'WITH RECURSIVE cte AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM cte WHERE n < 10) SELECT * FROM cte',
    result: 'Error: Maximum recursion depth exceeded.',
    status: 'failed',
    score: 32,
    dateTime: '2023-05-08 16:45:01',
  },
  {
    id: 4,
    user: 'anna.johnson@company.co',
    question: 'User Analytics',
    dbType: 'MySQL',
    query: 'SELECT user_id, COUNT(*) FROM orders GROUP BY user_id ORDER BY COUNT(*) DESC LIMIT 10',
    result: 'Query successful. 10 rows returned.',
    status: 'passed',
    score: 90,
    dateTime: '2023-05-08 11:20:39',
  },
  {
    id: 5,
    user: 'carlos.mendez@tech.edu',
    question: 'Basic Filtering',
    dbType: 'MySQL',
    query: 'SELECT * FROM products WHERE category = "electronics" AND price < 1000',
    result: 'Query successful. 24 rows returned.',
    status: 'passed',
    score: 100,
    dateTime: '2023-05-07 09:05:12',
  },
];

// Filter options
const questionOptions = [
  { value: 'Advanced SQL Joins', label: 'Advanced SQL Joins' },
  { value: 'Window Functions', label: 'Window Functions' },
  { value: 'Recursive CTEs', label: 'Recursive CTEs' },
  { value: 'User Analytics', label: 'User Analytics' },
  { value: 'Basic Filtering', label: 'Basic Filtering' },
];

const dbTypeOptions = [
  { value: 'MySQL', label: 'MySQL' },
  { value: 'PostgreSQL', label: 'PostgreSQL' },
];

const statusOptions = [
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
];

interface Submission {
  id: number;
  user: string;
  question: string;
  dbType: string;
  query: string;
  result: string;
  status: string;
  score: number;
  dateTime: string;
}

const Submissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(initialSubmissions);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [questionFilter, setQuestionFilter] = useState('');
  const [dbTypeFilter, setDbTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Search and filter submissions
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterSubmissions(term, questionFilter, dbTypeFilter, statusFilter);
  };
  
  const handleQuestionFilter = (question: string) => {
    setQuestionFilter(question);
    filterSubmissions(searchTerm, question, dbTypeFilter, statusFilter);
  };
  
  const handleDbTypeFilter = (dbType: string) => {
    setDbTypeFilter(dbType);
    filterSubmissions(searchTerm, questionFilter, dbType, statusFilter);
  };
  
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterSubmissions(searchTerm, questionFilter, dbTypeFilter, status);
  };
  
  const filterSubmissions = (
    term: string,
    question: string,
    dbType: string,
    status: string
  ) => {
    let filtered = [...submissions];
    
    if (term) {
      filtered = filtered.filter(submission => 
        submission.user.toLowerCase().includes(term.toLowerCase()) ||
        submission.question.toLowerCase().includes(term.toLowerCase()) ||
        submission.query.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (question) {
      filtered = filtered.filter(submission => submission.question === question);
    }
    
    if (dbType) {
      filtered = filtered.filter(submission => submission.dbType === dbType);
    }
    
    if (status) {
      filtered = filtered.filter(submission => submission.status === status);
    }
    
    setFilteredSubmissions(filtered);
  };
  
  // Open submission details dialog
  const openDetailsDialog = (submission: Submission) => {
    setCurrentSubmission(submission);
    setIsDetailsDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <PageHeader
        title="Submissions"
        description="Review user question submissions"
      />
      
      <SearchFilter
        searchPlaceholder="Search submissions..."
        onSearch={handleSearch}
        filters={[
          {
            name: "Question",
            options: questionOptions,
            value: questionFilter,
            onChange: handleQuestionFilter,
          },
          {
            name: "DB Type",
            options: dbTypeOptions,
            value: dbTypeFilter,
            onChange: handleDbTypeFilter,
          },
          {
            name: "Status",
            options: statusOptions,
            value: statusFilter,
            onChange: handleStatusFilter,
          },
        ]}
      />
      
      <div className="data-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Question</th>
                <th>DB Type</th>
                <th>Score</th>
                <th>Status</th>
                <th>Date/Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap">{submission.user}</td>
                  <td>{submission.question}</td>
                  <td>{submission.dbType}</td>
                  <td>{submission.score}%</td>
                  <td>
                    <StatusBadge
                      status={submission.status}
                      className={submission.status === 'passed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap">{submission.dateTime}</td>
                  <td>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openDetailsDialog(submission)}
                      className="flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Submission Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          
          {currentSubmission && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User</p>
                  <p className="mt-1">{currentSubmission.user}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Question</p>
                  <p className="mt-1">{currentSubmission.question}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">DB Type</p>
                  <p className="mt-1">{currentSubmission.dbType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date/Time</p>
                  <p className="mt-1">{currentSubmission.dateTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Score</p>
                  <p className="mt-1">{currentSubmission.score}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <StatusBadge
                    status={currentSubmission.status}
                    className={currentSubmission.status === 'passed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted Query</p>
                <div className="mt-1 bg-gray-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  {currentSubmission.query}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Result</p>
                <div className="mt-1 bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
                  {currentSubmission.result}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Submissions;
