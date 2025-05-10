
import React from 'react';
import { Bell, LogOut, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between">
      <div>
        <h1 className="text-xl font-semibold text-primary-dark">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-primary-accent rounded-full"></span>
        </button>
        
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
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
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
