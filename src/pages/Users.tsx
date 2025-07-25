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
import { fetchUsersPreview, toggleUserStatus, setFilters } from '@/redux/Slices/userSlice';
import { User as UserType } from '@/redux/Slices/userSlice';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { apiInstance } from "@/api/axiosApi";

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
  
  const userExportFields = [
    { label: "User ID", value: "userId" },
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Last Login", value: "lastLogin" },
    { label: "Status", value: "status" },
    { label: "Plan/Subscription Tier", value: "plan" },
    { label: "Promo Code/Campaign", value: "promoCode" },
    { label: "Registration Date", value: "registrationDate" },
    { label: "Total Attempted Questions", value: "totalAttempted" },
    { label: "Total Successful Questions", value: "totalSuccessful" },
    { label: "Actions", value: "actions" },
    { label: "Manual Plan Alteration", value: "manualPlanAlteration" },
  ];

  const userDateRanges = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "All", value: "all" },
  ];

  const [userExportDateRange, setUserExportDateRange] = React.useState("all");
  const [userExportFieldsSelected, setUserExportFieldsSelected] = React.useState(userExportFields.map(f => f.value));
  const [userExportPopoverOpen, setUserExportPopoverOpen] = React.useState(false);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    dispatch(
      fetchUsersPreview({
        fields: userExportFieldsSelected,
        search: filters.search,
        dateRange: userExportDateRange === '7d' ? '7' : userExportDateRange === '30d' ? '30' : 'all',
      })
    );
  }, [dispatch, filters.search, userExportFieldsSelected, userExportDateRange]);
  
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

  async function exportUsersToCSV() {
    const params = new URLSearchParams();
    params.append("dateRange", userExportDateRange === "7d" ? "7" : userExportDateRange === "30d" ? "30" : "all");
    userExportFieldsSelected.forEach(field => params.append("fields", field));
    try {
      const response = await apiInstance.get(
        `/api/export/admin/exportCSV?${params.toString()}`,
        { responseType: "blob" }
      );
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${userExportDateRange}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Export failed: " + (error?.message || "Unknown error"));
    }
  }
  
  // Calculate counts
  const activeCount = users.filter(u => (u.status || u.Status || '').toLowerCase() === 'active').length;
  const inactiveCount = users.filter(u => (u.status || u.Status || '').toLowerCase() === 'inactive').length;

  // Filter users in UI
  const filteredUsers = filters.status
    ? users.filter(u => (u.status || u.Status || '').toLowerCase() === filters.status)
    : users;

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
      
      <div className="flex gap-2 items-center mb-4">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={userExportDateRange}
          onChange={e => setUserExportDateRange(e.target.value)}
        >
          {userDateRanges.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {/* Field Selection Popover */}
        <Popover open={userExportPopoverOpen} onOpenChange={setUserExportPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[160px] flex justify-between items-center px-3 py-1 text-sm border">
              <span className="truncate text-left">
                {userExportFieldsSelected.length === userExportFields.length
                  ? "All Fields"
                  : userExportFieldsSelected.length === 0
                  ? "No Fields"
                  : userExportFields
                      .filter(f => userExportFieldsSelected.includes(f.value))
                      .map(f => f.label)
                      .slice(0, 2)
                      .join(", ") +
                    (userExportFieldsSelected.length > 2
                      ? ` +${userExportFieldsSelected.length - 2} more`
                      : "")}
              </span>
              <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.1l-4.25 3.84a.75.75 0 01-1.02 0l-4.25-3.84a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-2">
            {userExportFields.map(field => (
              <div key={field.value} className="flex items-center">
                <Checkbox
                  checked={userExportFieldsSelected.includes(field.value)}
                  onCheckedChange={() =>
                    setUserExportFieldsSelected(userExportFieldsSelected.includes(field.value)
                      ? userExportFieldsSelected.filter(f => f !== field.value)
                      : [...userExportFieldsSelected, field.value])
                  }
                  id={`user-field-${field.value}`}
                />
                <label htmlFor={`user-field-${field.value}`} className="ml-2 text-sm cursor-pointer">
                  {field.label}
                </label>
              </div>
            ))}
          </PopoverContent>
        </Popover>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={exportUsersToCSV}
        >
          Export CSV
        </Button>
      </div>

      {/* Add counts above the table */}
      {/* <div className="flex gap-4 mb-2">
        <span>Active: {activeCount}</span>
        <span>Inactive: {inactiveCount}</span>
      </div> */}

      <div className="data-card overflow-x-auto w-full">
        <div className="">
          <table className="">
            <thead>
              <tr>
                {userExportFields
                  .filter(f => userExportFieldsSelected.includes(f.value))
                  .map(field => (
                    <th key={field.value}>{field.label}</th>
                  ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={userExportFieldsSelected.length + 1} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={userExportFieldsSelected.length + 1} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {userExportFields
                      .filter(f => userExportFieldsSelected.includes(f.value))
                      .map(field => (
                        <td key={field.value} className="whitespace-nowrap">
                          {field.value === 'status' && (user.status || user.Status) ? (
                            <StatusBadge
                              status={String(user.status || user.Status || 'unknown')}
                              className={(user.status || user.Status)?.toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'}
                            />
                          ) : field.value === 'lastLogin' || field.value === 'registrationDate' ? (
                            user[field.value] ? formatDateTime(user[field.value]) : 'Never'
                          ) : (
                            user[field.value] ?? ''
                          )}
                        </td>
                      ))}
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
                            {(user.status || user.Status)?.toLowerCase() === 'active' ? (
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
                  <td colSpan={userExportFieldsSelected.length + 1} className="text-center py-4 text-gray-500">
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
