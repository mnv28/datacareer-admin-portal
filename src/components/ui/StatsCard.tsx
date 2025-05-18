
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
}

const StatsCard = ({ title, value, icon, change, className }: StatsCardProps) => {
  return (
    <div className={cn(
      "data-card flex items-start justify-between",
      className
    )}>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
        
        {/* {change && (
          <div className="mt-1 flex items-center text-xs">
            <span
              className={cn(
                "font-medium",
                change.positive ? "text-green-600" : "text-red-600"
              )}
            >
              {change.positive ? '+' : ''}{change.value}
            </span>
            <span className="ml-1 text-gray-500">from last month</span>
          </div>
        )} */}
      </div>
      
      <div className="p-2 rounded-lg bg-primary-lightest bg-opacity-20">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
