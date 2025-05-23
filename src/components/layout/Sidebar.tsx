import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logodatacareer from '../../../public/logoDataCareer.png';
import { 
  BarChart, 
  Users, 
  FileQuestion, 
  Building2, 
  BookOpen, 
  FileCheck, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      icon: BarChart,
      path: '/dashboard',
    },
    {
      name: 'Companies',
      icon: Building2,
      path: '/companies',
    },
    {
      name: 'Domains',
      icon: Tag,
      path: '/domains',
    },
    {
      name: 'Questions',
      icon: FileQuestion,
      path: '/questions',
    },
    {
      name: 'Topics',
      icon: BookOpen,
      path: '/topics',
    },
    {
      name: 'Submissions',
      icon: FileCheck,
      path: '/submissions',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/users',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  return (
    <aside
      className={cn(
        'bg-primary-dark text-white transition-all duration-300 ease-in-out flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn(
        'flex items-center p-4 h-16 border-b border-[#1a2855]',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center">
                 <img src={logodatacareer} alt="DataCareer App Logo" className="h-10 w-auto" />
            {/* <span className="font-bold text-xl">DataCareer</span> */}
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1.5 rounded-md hover:bg-primary hover:bg-opacity-25 transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center px-3 py-3 rounded-md transition-all',
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:bg-primary-dark hover:bg-opacity-70 hover:text-white',
                collapsed ? 'justify-center' : 'justify-start'
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span className="ml-3 font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[#1a2855]">
        <div className={cn(
          "flex items-center", 
          collapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <span className="font-medium text-primary-dark">A</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-300">admin@datacareer.app</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
