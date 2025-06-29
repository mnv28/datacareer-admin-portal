import React, { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import SearchFilter from '@/components/ui/SearchFilter';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { User, Eye, RotateCcw, Ban, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUsers, toggleUserStatus, setFilters } from '@/redux/Slices/userSlice';
import { User as UserType } from '@/redux/Slices/userSlice';

// Status filter options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const MM = String(date.getMinutes()).padStart(2, '0');
  const SS = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
}

const Users = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, filters } = useSelector((state: RootState) => state.users);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = React.useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  
  // Fetch users on component mount and when filters change
  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);
  
  // Search and filter users
  const handleSearch = (term: string) => {
    dispatch(setFilters({ search: term }));
  };
  
  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status }));
  };
  
  // Open user profile dialog
  const openProfileDialog = (user: UserType) => {
    setCurrentUser(user);
    setIsProfileDialogOpen(true);
  };
  
  // Open reset password dialog
  const openResetPasswordDialog = (user: UserType) => {
    setCurrentUser(user);
    setIsResetPasswordDialogOpen(true);
  };
  
  // Toggle user status (activate/deactivate)
  const handleToggleUserStatus = async (user: UserType) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(toggleUserStatus({ userId: user.id, newStatus })).unwrap();
      toast({
        title: "Success",
        description: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };
  
  // Handle password reset
  const handleResetPassword = () => {
    if (!currentUser) return;
    
    setIsResetPasswordDialogOpen(false);
    toast({
      title: "Success",
      description: "Password reset link sent to the user's email",
    });
  };
  
  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        description="Manage platform users"
      />
      
      <SearchFilter
        searchPlaceholder="Search users by name or email..."
        onSearch={handleSearch}
        filters={[
          {
            name: "Status",
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
                <th>Name</th>
                <th>Email</th>
                <th>Total Attempted</th>
                <th>Last Login</th>
                <th>Status</th>
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
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="font-medium">{user.name}</td>
                    <td className="whitespace-nowrap">{user.email}</td>
                    <td className="text-center">{user.totalAttempted}</td>
                    <td className="whitespace-nowrap">
                      {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                    </td>
                    <td>
                      <StatusBadge
                        status={user.status}
                        className={user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                        }
                      />
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex gap-1">
                            <Eye size={16} /> Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openProfileDialog(user)}>
                            <User size={16} className="mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openResetPasswordDialog(user)}>
                            <RotateCcw size={16} className="mr-2" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                            {user.status === 'active' ? (
                              <>
                                <Ban size={16} className="mr-2 text-red-500" /> Deactivate User
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="mr-2 text-green-500" /> Activate User
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          
          {currentUser && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary-lightest flex items-center justify-center text-xl font-bold text-primary-dark">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                  <p className="text-gray-500">{currentUser.email}</p>
                  <StatusBadge
                    status={currentUser.status}
                    className={`mt-1 ${currentUser.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                    }`}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Questions Attempted</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.totalAttempted}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.lastLogin ? formatDateTime(currentUser.lastLogin) : 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsProfileDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              This will send a password reset link to {currentUser?.email}. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword}
              className="bg-primary-light hover:bg-primary"
            >
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Users;
