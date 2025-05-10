
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">{title}</h1>
        {description && (
          <p className="mt-1 text-gray-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 md:mt-0 flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
