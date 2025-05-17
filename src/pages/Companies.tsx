import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import SearchFilter from '@/components/ui/SearchFilter';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Initial domains data (this should come from the Domains page in a real app)
const domainOptions = [
  { value: 'Retail', label: 'Retail' },
  { value: 'FMCG', label: 'FMCG' },
  { value: 'Loyalty', label: 'Loyalty' },
  { value: 'Customer Analytics', label: 'Customer Analytics' },
];

// Dummy data for companies
const initialCompanies = [
  { id: 1, name: 'Google', domains: ['Retail', 'Customer Analytics'], category: 'Tech', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Facebook', domains: ['Customer Analytics'], category: 'Social Media', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Amazon', domains: ['Retail', 'FMCG'], category: 'E-commerce', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Netflix', domains: ['Customer Analytics'], category: 'Entertainment', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Microsoft', domains: ['Retail', 'Loyalty'], category: 'Tech', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Twitter', domains: ['Social Media'], category: 'Social Media', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Airbnb', domains: ['Travel'], category: 'Travel', status: 'inactive', logo: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Spotify', domains: ['Entertainment'], category: 'Music', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 9, name: 'Uber', domains: ['Transportation'], category: 'Transportation', status: 'inactive', logo: 'https://via.placeholder.com/150' },
  { id: 10, name: 'LinkedIn', domains: ['Professional'], category: 'Professional', status: 'active', logo: 'https://via.placeholder.com/150' },
];

const categoryOptions = [
  { value: 'Tech', label: 'Tech' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Music', label: 'Music' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Professional', label: 'Professional' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface Company {
  id: number;
  name: string;
  domains: string[];
  category: string;
  status: string;
  logo?: string;
}

const Companies = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(initialCompanies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    domains: [],
    category: '',
    status: 'active',
    logo: '',
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filter companies based on search term and filters
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterCompanies(term, categoryFilter, statusFilter);
  };
  
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    filterCompanies(searchTerm, category, statusFilter);
  };
  
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterCompanies(searchTerm, categoryFilter, status);
  };
  
  const filterCompanies = (term: string, category: string, status: string) => {
    let filtered = [...companies];
    
    if (term) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(company => company.category === category);
    }
    
    if (status) {
      filtered = filtered.filter(company => company.status === status);
    }
    
    setFilteredCompanies(filtered);
    return filtered;
  };
  
  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'domains') {
      setFormData({ ...formData, domains: value ? value.split(',') : [] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDomainsChange = (domains: string[]) => {
    setFormData(prev => ({ ...prev, domains: domains }));
  };
  
  // Open dialog for creating or editing a company
  const openDialog = (company: Company | null = null) => {
    if (company) {
      setCurrentCompany(company);
      setFormData({
        name: company.name,
        domains: Array.isArray(company.domains) ? company.domains : [],
        category: company.category,
        status: company.status,
        logo: company.logo || '',
      });
    } else {
      setCurrentCompany(null);
      setFormData({
        name: '',
        domains: [],
        category: '',
        status: 'active',
        logo: '',
      });
    }
    setIsDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.domains?.length || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (currentCompany) {
      // Update existing company
      const updatedCompanies = companies.map(company => 
        company.id === currentCompany.id ? { ...company, ...formData } : company
      );
      setCompanies(updatedCompanies);
      filterCompanies(searchTerm, categoryFilter, statusFilter);
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
    } else {
      // Create new company
      const newCompany = {
        id: companies.length + 1,
        name: formData.name!,
        domains: formData.domains!,
        category: formData.category!,
        status: formData.status || 'active',
        logo: formData.logo || 'https://via.placeholder.com/150',
      };
      const updatedCompanies = [...companies, newCompany];
      setCompanies(updatedCompanies);
      setFilteredCompanies(updatedCompanies);
      toast({
        title: "Success",
        description: "Company created successfully",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  // Handle company deletion
  const handleDelete = () => {
    if (!currentCompany) return;
    
    const updatedCompanies = companies.filter(company => company.id !== currentCompany.id);
    setCompanies(updatedCompanies);
    filterCompanies(searchTerm, categoryFilter, statusFilter);
    
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Company deleted successfully",
    });
  };
  
  return (
    <AdminLayout>
      <PageHeader
        title="Companies"
        description="Manage companies available on the platform"
        actions={
          <Button onClick={() => openDialog()} className="bg-primary-light hover:bg-primary">
            <Plus size={16} className="mr-1" /> Add Company
          </Button>
        }
      />
      
      <SearchFilter
        searchPlaceholder="Search companies..."
        onSearch={handleSearch}
        filters={[
          {
            name: "Category",
            options: categoryOptions,
            value: categoryFilter,
            onChange: handleCategoryFilter,
          },
          {
            name: "Status",
            options: statusOptions,
            value: statusFilter,
            onChange: handleStatusFilter,
          },
        ]}
      />
      
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-4 pr-6 py-3">Name</th>
                <th>Domains</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="pl-4 pr-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-md flex-shrink-0 mr-3">
                        {company.logo && (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain rounded-md"
                          />
                        )}
                      </div>
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {company.domains.map((domain) => (
                        <Badge key={domain} variant="secondary">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>{company.category}</td>
                  <td>
                    <StatusBadge status={company.status} />
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openDialog(company)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openDeleteDialog(company)}
                        className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No companies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create/Edit Company Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentCompany ? 'Edit Company' : 'Add New Company'}
            </DialogTitle>
            <DialogDescription>
              {currentCompany 
                ? 'Update the company details below.'
                : 'Enter the company details to add it to the platform.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Company Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Domains*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between mt-1"
                    >
                      {formData.domains?.length > 0
                        ? `${formData.domains.length} domains selected`
                        : "Select domains..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput placeholder="Search domains..." />
                      <CommandList>
                        <CommandEmpty>No domain found.</CommandEmpty>
                        <CommandGroup>
                          {domainOptions.map((domain) => (
                            <CommandItem
                              key={domain.value}
                              onSelect={() => {
                                const currentDomains = formData.domains || [];
                                const newDomains = currentDomains.includes(domain.value)
                                  ? currentDomains.filter((d) => d !== domain.value)
                                  : [...currentDomains, domain.value];
                                handleDomainsChange(newDomains);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.domains?.includes(domain.value) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {domain.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.domains?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.domains.map((domain) => (
                      <Badge key={domain} variant="secondary">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category*</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select category</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || 'active'}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo">Logo URL (optional)</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="mt-1"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-light hover:bg-primary">
                {currentCompany ? 'Update Company' : 'Create Company'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentCompany?.name}? This action cannot be undone.
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
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Companies;
