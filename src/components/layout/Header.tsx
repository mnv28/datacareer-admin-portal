import React from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/Slices/authSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {

    dispatch(logout());

    authLogout();

    localStorage.removeItem('token');

    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between">
      <div>
        <h1 className="text-xl font-semibold text-primary-dark">Admin Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 hover:bg-gray-50 rounded-full pl-2 pr-3 py-1.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="font-medium text-white">A</span>
              </div>
              <div className="hidden md:block text-sm font-medium">Admin</div>
              <ChevronDown size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings?tab=account')} className='cursor-pointer'>
              <span >Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings?tab=features')} className='cursor-pointer'>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
