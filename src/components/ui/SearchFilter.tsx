
import React from 'react';
import { Search } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  filters?: {
    name: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  children?: React.ReactNode;
}

const SearchFilter = ({
  searchPlaceholder = 'Search...',
  onSearch,
  filters,
  children
}: SearchFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="search"
          className="block w-full p-2.5 pl-10 text-sm border border-gray-200 rounded-lg bg-white"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <select
              key={filter.name}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
            >
              <option value="">{filter.name}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

export default SearchFilter;
