
import React, { useState } from 'react';
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

// Dummy data for users
const initialUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    beginnerCount: 10,
    intermediateCount: 5,
    advancedCount: 2,
    totalAttempted: 17,
    lastLogin: '2023-05-09',
    status: 'active',
  },
  {
    id: 2,
    name: 'Sarah Parker',
    email: 'sarah.parker@gmail.com',
    beginnerCount: 8,
    intermediateCount: 12,
    advancedCount: 6,
    totalAttempted: 26,
    lastLogin: '2023-05-08',
    status: 'active',
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@outlook.com',
    beginnerCount: 3,
    intermediateCount: 0,
    advancedCount: 0,
    totalAttempted: 3,
    lastLogin: '2023-05-07',
    status: 'inactive',
  },
  {
    id: 4,
    name: 'Anna Johnson',
    email: 'anna.johnson@company.co',
    beginnerCount: 15,
    intermediateCount: 9,
    advancedCount: 3,
    totalAttempted: 27,
    lastLogin: '2023-05-09',
    status: 'active',
  },
  {
    id: 5,
    name: 'Carlos Mendez',
    email: 'carlos.mendez@tech.edu',
    beginnerCount: 5,
    intermediateCount: 3,
    advancedCount: 0,
    totalAttempted: 8,
    lastLogin: '2023-05-06',
    status: 'active',
  },
];

// Status filter options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface UserData {
  id: number;
  name: string;
  email: string;
  beginnerCount: number;
  intermediateCount: number;
  advancedCount: number;
  totalAttempted: number;
  lastLogin: string;
  status: string;
}

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(initialUsers);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Search and filter users
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterUsers(term, statusFilter);
  };
  
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterUsers(searchTerm, status);
  };
  
  const filterUsers = (term: string, status: string) => {
    let filtered = [...users];
    
    if (term) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (status) {
      filtered = filtered.filter(user => user.status === status);
    }
    
    setFilteredUsers(filtered);
  };
  
  // Open user profile dialog
  const openProfileDialog = (user: UserData) => {
    setCurrentUser(user);
    setIsProfileDialogOpen(true);
  };
  
  // Open reset password dialog
  const openResetPasswordDialog = (user: UserData) => {
    setCurrentUser(user);
    setIsResetPasswordDialogOpen(true);
  };
  
  // Toggle user status (activate/deactivate)
  const toggleUserStatus = (user: UserData) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    );
    
    setUsers(updatedUsers);
    setFilteredUsers(
      filterUsers(searchTerm, statusFilter)
    );
    
    toast({
      title: "Success",
      description: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
    });
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
                <th>Name</th>
                <th>Email</th>
                <th>Progress Summary</th>
                <th>Total Attempted</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="font-medium">{user.name}</td>
                  <td className="whitespace-nowrap">{user.email}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">B</span>
                        <span className="text-sm font-medium">{user.beginnerCount}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">I</span>
                        <span className="text-sm font-medium">{user.intermediateCount}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">A</span>
                        <span className="text-sm font-medium">{user.advancedCount}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">{user.totalAttempted}</td>
                  <td className="whitespace-nowrap">{user.lastLogin}</td>
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
                        <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
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
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
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
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Progress Summary</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="data-card p-4 flex flex-col items-center">
                      <span className="text-xs text-gray-500">Beginner</span>
                      <span className="text-2xl font-bold mt-1 text-primary">{currentUser.beginnerCount}</span>
                    </div>
                    <div className="data-card p-4 flex flex-col items-center">
                      <span className="text-xs text-gray-500">Intermediate</span>
                      <span className="text-2xl font-bold mt-1 text-primary">{currentUser.intermediateCount}</span>
                    </div>
                    <div className="data-card p-4 flex flex-col items-center">
                      <span className="text-xs text-gray-500">Advanced</span>
                      <span className="text-2xl font-bold mt-1 text-primary">{currentUser.advancedCount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Questions Attempted</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.totalAttempted}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
                    <p className="text-lg font-medium mt-1">{currentUser.lastLogin}</p>
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
