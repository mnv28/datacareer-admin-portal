import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import SearchFilter from '@/components/ui/SearchFilter';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveDomains } from '@/redux/Slices/domainSlice';
import { fetchCompanies, setFilters, type Company, deleteCompany, updateCompany, createCompany } from '@/redux/Slices/companySlice';
import type { RootState, AppDispatch } from '@/redux/store';
import type { Domain } from '@/redux/Slices/domainSlice';

interface CompanyFormData {
  name: string;
  domains: number[];
  // category: string;
  status: string;
  logo: string | File;
}

// const categoryOptions = [
//   { value: 'Tech', label: 'Tech' },
//   { value: 'Social Media', label: 'Social Media' },
//   { value: 'E-commerce', label: 'E-commerce' },
//   { value: 'Entertainment', label: 'Entertainment' },
//   { value: 'Travel', label: 'Travel' },
//   { value: 'Music', label: 'Music' },
//   { value: 'Transportation', label: 'Transportation' },
//   { value: 'Professional', label: 'Professional' },
// ];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const Companies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { domains, loading: domainsLoading } = useSelector((state: RootState) => state.domains);
  const { companies, loading: companiesLoading, filters, error } = useSelector((state: RootState) => state.company);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    domains: [],
    // category: '',
    status: 'active',
    logo: '',
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch domains and companies when component mounts
  useEffect(() => {
    dispatch(fetchActiveDomains())
    dispatch(fetchCompanies(filters));
  }, [dispatch, filters]);

  // Handle search and filters
  const handleSearch = (term: string) => {
    dispatch(setFilters({ search: term }));
  };
  
  // const handleCategoryFilter = (category: string) => {
  //   dispatch(setFilters({ category }));
  // };
  
  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status }));
  };
  
  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'domains') {
      // Convert string values to numbers
      const domainIds = value ? value.split(',').map(id => parseInt(id, 10)) : [];
      setFormData({ ...formData, domains: domainIds });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDomainsChange = (domains: number[]) => {
    setFormData(prev => ({ ...prev, domains: domains }));
  };
  
  // Open dialog for creating or editing a company
  const openDialog = (company: Company | null = null) => {
    if (company) {
      setCurrentCompany(company);
      setFormData({
        name: company.name,
        domains: company.Domains.map(d => d.id),
        // category: company.category,
        status: company.status.toLowerCase(),
        logo: company.logo,
      });
      setLogoPreview(company.logo);
    } else {
      setCurrentCompany(null);
      setFormData({
        name: '',
        domains: [],
        // category: '',
        status: '',
        logo: '',
      });
      setLogoPreview('');
    }
    setIsDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast({
          title: "Error",
          description: "Please upload a valid image file (JPG, JPEG, or PNG)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      setLogoPreview(imageUrl);
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.domains?.length || !formData.logo || !formData.status) {
      toast({
        title: "Error",
        description: "Please fill all required fields including company logo and status",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('domains', JSON.stringify(formData.domains));
      // formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status || 'active');

      // If logo is a File object (from file input)
      if (formData.logo instanceof File) {
        formDataToSend.append('logo', formData.logo);
      } else if (typeof formData.logo === 'string' && formData.logo.startsWith('data:')) {
        // If logo is a data URL, convert it to a File
        const response = await fetch(formData.logo);
        const blob = await response.blob();
        const file = new File([blob], 'logo.png', { type: blob.type });
        formDataToSend.append('logo', file);
      } else if (typeof formData.logo === 'string') {
        // If logo is a URL string, fetch it and convert to File
        const response = await fetch(formData.logo);
        const blob = await response.blob();
        const file = new File([blob], 'logo.png', { type: blob.type });
        formDataToSend.append('logo', file);
      }

      if (currentCompany) {
        // Update existing company
        const result = await dispatch(updateCompany({ 
          id: currentCompany.id, 
          formData: formDataToSend 
        })).unwrap();

        console.log('Update result:', result);
        
        toast({
          title: "Success",
          description: "Company updated successfully",
        });
      } else {
        // Create new company
        const result = await dispatch(createCompany(formDataToSend)).unwrap();
        
        console.log('Create result:', result);
        
        toast({
          title: "Success",
          description: "Company created successfully",
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error as string || "Failed to save company",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle company deletion
  const handleDelete = async () => {
    if (!currentCompany) return;
    
    try {
      await dispatch(deleteCompany(currentCompany.id)).unwrap();
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error as string || "Failed to delete company",
        variant: "destructive",
      });
    }
  };
  
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(filters.search?.toLowerCase() || '')
  );
  
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
        searchPlaceholder="Search by company name..."
        onSearch={handleSearch}
        filters={[
          // {
          //   name: "Category",
          //   options: categoryOptions,
          //   value: filters.category,
          //   onChange: handleCategoryFilter,
          // },
          {
            name: "Status",
            options: statusOptions,
            value: filters.status,
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
                {/* <th>Category</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companiesLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No companies found
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
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
                        <span className="font-medium">{company.name} </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(company.Domains) && company.Domains.map((domain) => (
                          <Badge key={domain.id} variant="secondary">
                            {domain.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    {/* <td>{company.category}</td> */}
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
                ))
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
                      disabled={domainsLoading}
                    >
                      {domainsLoading 
                        ? "Loading domains..."
                        : formData.domains?.length > 0
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
                          {domains.map((domain) => (
                            <CommandItem
                              key={domain.id}
                              onSelect={() => {
                                const currentDomains = formData.domains || [];
                                const newDomains = currentDomains.includes(domain.id)
                                  ? currentDomains.filter((d) => d !== domain.id)
                                  : [...currentDomains, domain.id];
                                handleDomainsChange(newDomains);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.domains?.includes(domain.id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {domain.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.domains?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.domains.map((domainId) => {
                      const domain = domains.find(d => d.id === domainId);
                      return domain ? (
                        <Badge key={domain.id} variant="secondary">
                          {domain.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              
              <div className="">
                {/* <div>
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
                </div> */}
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select Status</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo">Company Logo*</Label>
                <div className="mt-1 flex items-center gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleLogoChange}
                    className="w-full"
                  />
                  {logoPreview && (
                    <div className="relative w-20 h-20">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain border rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, logo: '' }));
                          setLogoPreview('');
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, JPEG, PNG (max 5MB)
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-light hover:bg-primary"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (currentCompany ? "Updating..." : "Creating...") 
                  : (currentCompany ? "Update Company" : "Create Company")
                }
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
