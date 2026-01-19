import React, { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import SearchFilter from '@/components/ui/SearchFilter';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { User, Eye, RotateCcw, Ban, CheckCircle, Trash2, ArrowUpDown } from 'lucide-react';
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
import { fetchUsersPreview, toggleUserStatus, setFilters, changeUserPlan, resetUserPassword, deleteUser, UserPlan } from '@/redux/Slices/userSlice';
import { User as UserType } from '@/redux/Slices/userSlice';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiInstance } from "@/api/axiosApi";
import Pagination from "@/components/ui/pagination";

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
  const [isPlanDialogOpen, setIsPlanDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<UserPlan>('free');
  const [cancelStripe, setCancelStripe] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');

  const userExportFields = [
    { label: "User ID", value: "userId" },
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Last Login", value: "lastLogin" },
    { label: "Status", value: "status" },
    { label: "Plan/Subscription Tier", value: "plan" },
    { label: "Promo Code/Campaign", value: "promoCode" },
    { label: "Subscription Start Date", value: "subscriptionStartDate" },
    { label: "Registration Date", value: "registrationDate" },
    { label: "Total Attempted Questions", value: "totalAttempted" },
    { label: "Total Successful Questions", value: "totalSuccessful" },
    // { label: "Actions", value: "actions" },
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

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number | string>(10);

  // Sorting state
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

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
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Open user profile dialog
  const openProfileDialog = (user: UserType) => {
    setCurrentUser(user);
    setIsProfileDialogOpen(true);
  };

  // Open reset password dialog
  const openResetPasswordDialog = (user: UserType) => {
    setCurrentUser(user);
    setNewPassword(''); // Reset password field when opening dialog
    setIsResetPasswordDialogOpen(true);
  };

  // Open plan alteration dialog
  const openPlanDialog = (user: UserType) => {
    setCurrentUser(user);
    const currentPlan = String(user.planType ?? user.plan ?? '').toLowerCase();
    setSelectedPlan(currentPlan === 'pro' ? 'pro' : 'free');
    setCancelStripe(false);
    setIsPlanDialogOpen(true);
  };

  // Toggle user status (activate/deactivate)
  const handleToggleUserStatus = async (user: UserType) => {
    console.log("user  = =", user);

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    console.log("newStatus = ", newStatus);

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

  // Open delete user dialog
  const openDeleteDialog = (user: UserType) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      await dispatch(deleteUser({ userId: currentUser.id })).unwrap();

      // Refresh users list
      await dispatch(
        fetchUsersPreview({
          fields: userExportFieldsSelected,
          search: filters.search,
          dateRange: userExportDateRange === '7d' ? '7' : userExportDateRange === '30d' ? '30' : 'all',
        })
      );

      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "User deleted successfully",
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
  const handleResetPassword = async () => {
    if (!currentUser) return;

    if (!newPassword || newPassword.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(resetUserPassword({ userId: currentUser.id, newPassword: newPassword.trim() })).unwrap();
      setIsResetPasswordDialogOpen(false);
      setNewPassword(''); // Clear password after success
      toast({
        title: "Success",
        description: "User password has been reset successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
  };

  const handleChangePlan = async () => {
    if (!currentUser) return;

    try {
      await dispatch(
        changeUserPlan({
          userId: currentUser.id,
          plan: selectedPlan,
          ...(selectedPlan === 'free' ? { cancelStripe } : {}),
        })
      ).unwrap();

      // Refresh with current UI filters/fields
      await dispatch(
        fetchUsersPreview({
          fields: userExportFieldsSelected,
          search: filters.search,
          dateRange: userExportDateRange === '7d' ? '7' : userExportDateRange === '30d' ? '30' : 'all',
        })
      );

      setIsPlanDialogOpen(false);
      toast({
        title: "Success",
        description: `User plan updated to ${selectedPlan.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    }
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
  let filteredUsers = filters.status
    ? users.filter(u => (u.status || u.Status || '').toLowerCase() === filters.status)
    : users;

  // Sort users by User ID
  if (sortField === 'userId') {
    filteredUsers = [...filteredUsers].sort((a, b) => {
      const aValue = a.id || 0;
      const bValue = b.id || 0;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  // Calculate pagination
  const isUnlimited = pageSize === "Unlimited";
  const perPage = isUnlimited ? filteredUsers.length || 1 : Number(pageSize);
  const totalPages = isUnlimited ? 1 : Math.ceil(filteredUsers.length / perPage);
  const startIndex = isUnlimited ? 0 : (currentPage - 1) * perPage;
  const endIndex = isUnlimited ? filteredUsers.length : startIndex + perPage;
  const paginatedUsers = isUnlimited ? filteredUsers : filteredUsers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number | string) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
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

      <div className="flex gap-2 items-center mb-4">
        <select
          className="border rounded px-2 py-1 text-sm cursor-pointer"
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
            <Button variant="outline" className="min-w-[160px] flex justify-between items-center px-3 py-1 text-sm border cursor-pointer">
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
          variant="outline"
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            if (sortField === 'userId') {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setSortField('userId');
              setSortOrder('asc');
            }
          }}
        >
          <ArrowUpDown size={16} />
          Sort {sortField === 'userId' && (sortOrder === 'asc' ? '' : '')}
        </Button>
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

      <div className="data-card overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {userExportFields
                  .filter(f => userExportFieldsSelected.includes(f.value))
                  .map(field => (
                    <th key={field.value}>
                      {field.label}
                    </th>
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
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (

                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* console.log("user = ",user) */}

                    {userExportFields
                      .filter(f => userExportFieldsSelected.includes(f.value))
                      .map(field => (
                        <td key={field.value} className="whitespace-nowrap">
                          {field.value === 'status' ? (
                            <StatusBadge
                              status={String(user.status || user.Status || 'unknown')}
                              className={(user.status || user.Status)?.toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'}
                            />
                          ) : field.value === 'manualPlanAlteration' ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openPlanDialog(user)}
                              >
                                Change Plan
                              </Button>
                              <span className="text-xs text-gray-500">
                                {String(user.planType ?? user.plan ?? '').toLowerCase() === 'pro' ? 'pro' : 'free'}
                              </span>
                            </div>
                          ) : field.value === 'plan' ? (
                            (() => {
                              const plan = String(user.planType ?? user.plan ?? '').toLowerCase();
                              if (plan === 'free' || plan === 'trial') return 'On Trial';
                              if (plan === 'pro' || plan === 'premium') {
                                return user.promoCode ? 'Pro (Coupon)' : 'Pro';
                              }
                              return plan;
                            })()
                          ) : field.value === 'lastLogin' || field.value === 'subscriptionStartDate' || field.value === 'registrationDate' ? (
                            user[field.value] ? formatDateTime(user[field.value]) : 'Never'
                          ) : field.value === 'userId' ? (
                            user.id
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
                          <DropdownMenuItem onClick={() => openProfileDialog(user)} className='cursor-pointer'>
                            <User size={16} className="mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openResetPasswordDialog(user)} className='cursor-pointer'>
                            <RotateCcw size={16} className="mr-2" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleUserStatus(user)} className='cursor-pointer'>
                            {(user.status || user.Status)?.toLowerCase() === 'active' ? (
                              <>
                                <Ban size={16} className="mr-2" /> Deactivate User
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="mr-2 text-green-500" /> Activate User
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <Trash2 size={16} className="mr-2" /> Delete User
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

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          rowsPerPage={pageSize}
          totalItems={filteredUsers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[10, 20, 50, 100, "Unlimited"]}
        />
      )}

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
                    <p className="text-lg font-medium mt-1">{currentUser.totalAttempted || '0'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Successful Questions</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.totalSuccessful || '0'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.lastLogin ? formatDateTime(currentUser.lastLogin) : 'Never'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Subscription Start Date</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.subscriptionStartDate ? formatDateTime(currentUser.subscriptionStartDate) : 'Unknown'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Registration Date</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.registrationDate ? formatDateTime(currentUser.registrationDate) : 'Unknown'}</p>
                  </div>
                </div>

                {/* Actions Display */}
                {currentUser.actions && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">User Actions</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700 font-mono">
                        {Array.isArray(currentUser.actions)
                          ? currentUser.actions.join(', ')
                          : currentUser.actions
                        }
                      </p>
                    </div>
                  </div>
                )}
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
              Set a new password for {currentUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

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
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Plan Alteration Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Manual Plan Alteration</DialogTitle>
            <DialogDescription>
              Change subscription tier for {currentUser?.email}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                Current plan: <span className="font-medium">{String(currentUser?.planType ?? currentUser?.plan ?? 'unknown')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New plan</label>
              <select
                className="border rounded px-2 py-2 text-sm w-full cursor-pointer"
                value={selectedPlan}
                onChange={(e) => {
                  const next = e.target.value as UserPlan;
                  setSelectedPlan(next);
                  if (next !== 'free') setCancelStripe(false);
                }}
              >
                <option value="free">free (trial)</option>
                <option value="pro">pro (premium)</option>
              </select>
            </div>

            {selectedPlan === 'free' && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={cancelStripe}
                  onCheckedChange={(v) => setCancelStripe(Boolean(v))}
                  id="cancel-stripe"
                />
                <label htmlFor="cancel-stripe" className="text-sm cursor-pointer">
                  Cancel Stripe subscription (optional)
                </label>
              </div>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePlan} className="bg-primary-light hover:bg-primary">
              Update Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong>{currentUser?.name}</strong> ({currentUser?.email})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Users;
