import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobDatabase = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh process
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Success",
        description: "GCP Database refresh initiated successfully",
      });
    }, 2000);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Job Database"
        description="Manage and refresh job database from GCP"
      />
      
      <div className="mt-8">
        <div className="data-card max-w-2xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Database Refresh</h3>
              <p className="text-sm text-gray-600 mb-4">
                Click the button below to initiate a refresh of the job database from GCP (Google Cloud Platform).
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Refresh Job Data from GCP
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  This will sync the latest job postings from the GCP database
                </p>
              </div>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto bg-primary-light hover:bg-primary flex items-center gap-2"
              size="lg"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Initiate Refresh with GCP Database
                </>
              )}
            </Button>

            {isRefreshing && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⏳ Database refresh in progress... Please wait.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default JobDatabase;

