
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

// Dummy data for companies
const initialCompanies = [
  { id: 1, name: 'Google', domain: 'google.com', category: 'Tech', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Facebook', domain: 'facebook.com', category: 'Social Media', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Amazon', domain: 'amazon.com', category: 'E-commerce', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Netflix', domain: 'netflix.com', category: 'Entertainment', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Microsoft', domain: 'microsoft.com', category: 'Tech', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Twitter', domain: 'twitter.com', category: 'Social Media', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Airbnb', domain: 'airbnb.com', category: 'Travel', status: 'inactive', logo: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Spotify', domain: 'spotify.com', category: 'Music', status: 'active', logo: 'https://via.placeholder.com/150' },
  { id: 9, name: 'Uber', domain: 'uber.com', category: 'Transportation', status: 'inactive', logo: 'https://via.placeholder.com/150' },
  { id: 10, name: 'LinkedIn', domain: 'linkedin.com', category: 'Professional', status: 'active', logo: 'https://via.placeholder.com/150' },
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
  domain: string;
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
    domain: '',
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
        company.name.toLowerCase().includes(term.toLowerCase()) || 
        company.domain.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(company => company.category === category);
    }
    
    if (status) {
      filtered = filtered.filter(company => company.status === status);
    }
    
    setFilteredCompanies(filtered);
  };
  
  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Open dialog for creating or editing a company
  const openDialog = (company: Company | null = null) => {
    if (company) {
      setCurrentCompany(company);
      setFormData({
        name: company.name,
        domain: company.domain,
        category: company.category,
        status: company.status,
        logo: company.logo || '',
      });
    } else {
      setCurrentCompany(null);
      setFormData({
        name: '',
        domain: '',
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
    
    if (!formData.name || !formData.domain || !formData.category) {
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
      setFilteredCompanies(
        filterCompanies(searchTerm, categoryFilter, statusFilter)
      );
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
    } else {
      // Create new company
      const newCompany = {
        id: companies.length + 1,
        name: formData.name!,
        domain: formData.domain!,
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
    setFilteredCompanies(
      filterCompanies(searchTerm, categoryFilter, statusFilter)
    );
    
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
      
      <div className="data-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-4 pr-6 py-3">Name</th>
                <th>Domain</th>
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
                  <td>{company.domain}</td>
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
                <Label htmlFor="domain">Domain*</Label>
                <Input
                  id="domain"
                  name="domain"
                  value={formData.domain || ''}
                  onChange={handleChange}
                  placeholder="example.com"
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
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
                
                <div className="flex-1">
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
