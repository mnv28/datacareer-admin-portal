
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'inactive' | 'pending' | 'beginner' | 'intermediate' | 'advanced';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-primary-accent bg-opacity-10 text-primary-accent';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={cn(
        'status-badge',
        getStatusStyles(),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
