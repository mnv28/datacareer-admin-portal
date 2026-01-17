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
  Tag,
  Database,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar = ({ onCollapsedChange }: SidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [questionDbOpen, setQuestionDbOpen] = useState(true);

  // Notify parent when collapsed state changes
  React.useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  // Top-level nav items
  const navItems = [
    {
      name: 'Dashboard',
      icon: BarChart,
      path: '/dashboard',
    },

  ];

  // Question Database sub-items
  const questionDbItems = [
    {
      name: 'Domains',
      icon: Tag,
      path: '/domains',
    },
    {
      name: 'Companies',
      icon: Building2,
      path: '/companies',
    },
    {
      name: 'Tables',
      icon: FileCheck,
      path: '/tables',
    },
    {
      name: 'Database',
      icon: Database,
      path: '/database',
    },
    {
      name: 'Topics',
      icon: BookOpen,
      path: '/topics',
    },
    {
      name: 'Questions',
      icon: FileQuestion,
      path: '/questions',
    },
    {
      name: 'Submissions',
      icon: FileCheck,
      path: '/submissions',
    },
  ];

  // Remaining top-level nav items
  const bottomNavItems = [
    {
      name: 'Job Database',
      icon: Database, // Placeholder, replace with a more suitable icon if available
      path: '/job-database',
    },
    {
      name: 'Home Page',
      icon: BookOpen,
      path: '/landing-page',
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
        'bg-primary-dark text-white transition-all duration-300 ease-in-out flex flex-col h-screen',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn(
        'flex items-center p-4 h-16 border-b border-[#1a2855]',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center">
            <img src={logodatacareer} alt="DataCareer App Logo" className="w-auto" />
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
        {/* Top-level nav items */}
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

        {/* Collapsible Question Database group */}
        <div>
          <button
            onClick={() => setQuestionDbOpen((open) => !open)}
            className={cn(
              'flex items-center w-full px-3 py-3 rounded-md transition-all text-gray-300 hover:bg-primary-dark hover:bg-opacity-70 hover:text-white',
              collapsed ? 'justify-center' : 'justify-start'
            )}
            aria-expanded={questionDbOpen}
          >
            <Database size={20} />
            {!collapsed && <span className="ml-3 font-medium">Question Database</span>}
            {!collapsed && (
              <span className="ml-auto">{questionDbOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            )}
          </button>
          {questionDbOpen && !collapsed && (
            <div className="ml-7 mt-1 space-y-1">
              {questionDbItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      'flex items-center px-2 py-2 rounded-md transition-all',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-primary-dark hover:bg-opacity-70 hover:text-white'
                    )}
                  >
                    <item.icon size={18} />
                    <span className="ml-2 text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom nav items */}
        {bottomNavItems.map((item) => {
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
