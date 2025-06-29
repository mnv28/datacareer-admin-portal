import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSubmissions, setFilters, Submission } from '@/redux/Slices/submissionSlice';
import { Label } from 'recharts';

// Filter options
const dbTypeOptions = [
  { value: 'MySQL', label: 'MySQL' },
  // { value: 'PostgreSQL', label: 'PostgreSQL' },
];

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'passed', label: 'Passed' },
  // { value: 'failed', label: 'Failed' },
  { value: 'error', label: 'Error' },
  { value: 'mismatch', label: 'MisMatch' }
];

const Submissions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);

  // Redux state
  const { submissions, loading, error, filters } = useSelector((state: RootState) => state.submissions);

  // Fetch submissions
  useEffect(() => {
    dispatch(fetchSubmissions(filters));
  }, [dispatch, filters]);

  // Handle filters
  const handleDbTypeFilter = (dbType: string) => {
    dispatch(setFilters({ dbType }));
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status }));
  };

  const handleSearch = (search: string) => {
    dispatch(setFilters({ search }));
  };

  // Open submission details dialog
  const openDetailsDialog = (submission: Submission) => {
    setCurrentSubmission(submission);
    setIsDetailsDialogOpen(true);
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
            name: "DB Type",
            options: dbTypeOptions,
            value: filters.dbType,
            onChange: handleDbTypeFilter,
          },
          {
            name: "Select Status",
            options: statusOptions,
            value: filters.status,
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
                <th>Status</th>
                <th>Date/Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No submissions found
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap">{submission.user}</td>
                    <td>{submission.question}</td>
                    <td>{submission.dbType}</td>
                    <td>
                      {/* <StatusBadge
                        status={submission.status}
                        className={submission.status === 'passed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      /> */}
                      <StatusBadge
                        status={submission.status}
                        className={
                          submission.status === 'passed'
                            ? 'bg-green-100 text-green-800'
                            : submission.status === 'mismatch'
                              ? 'bg-yellow-100 text-yellow-800'
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
                ))
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
