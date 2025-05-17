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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Initial domains data
const initialDomains = [
  { id: 1, name: 'Retail', description: 'Retail industry domain', status: 'active' },
  { id: 2, name: 'FMCG', description: 'Fast Moving Consumer Goods domain', status: 'active' },
  { id: 3, name: 'Loyalty', description: 'Customer Loyalty domain', status: 'active' },
  { id: 4, name: 'Customer Analytics', description: 'Customer Analytics domain', status: 'active' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface Domain {
  id: number;
  name: string;
  description: string;
  status: string;
}

const Domains = () => {
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>(initialDomains);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<Domain | null>(null);
  const [formData, setFormData] = useState<Partial<Domain>>({
    name: '',
    description: '',
    status: 'active',
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filter domains based on search term and filters
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterDomains(term, statusFilter);
  };
  
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterDomains(searchTerm, status);
  };
  
  const filterDomains = (term: string, status: string) => {
    let filtered = [...domains];
    
    if (term) {
      filtered = filtered.filter(domain => 
        domain.name.toLowerCase().includes(term.toLowerCase()) || 
        domain.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (status) {
      filtered = filtered.filter(domain => domain.status === status);
    }
    
    setFilteredDomains(filtered);
  };
  
  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Open dialog for creating or editing a domain
  const openDialog = (domain: Domain | null = null) => {
    if (domain) {
      setCurrentDomain(domain);
      setFormData({
        name: domain.name,
        description: domain.description,
        status: domain.status,
      });
    } else {
      setCurrentDomain(null);
      setFormData({
        name: '',
        description: '',
        status: 'active',
      });
    }
    setIsDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (domain: Domain) => {
    setCurrentDomain(domain);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (currentDomain) {
      // Update existing domain
      const updatedDomains = domains.map(domain => 
        domain.id === currentDomain.id ? { ...domain, ...formData } : domain
      );
      setDomains(updatedDomains);
      filterDomains(searchTerm, statusFilter);
      toast({
        title: "Success",
        description: "Domain updated successfully",
      });
    } else {
      // Create new domain
      const newDomain = {
        id: domains.length + 1,
        name: formData.name!,
        description: formData.description!,
        status: formData.status || 'active',
      };
      const updatedDomains = [...domains, newDomain];
      setDomains(updatedDomains);
      setFilteredDomains(updatedDomains);
      toast({
        title: "Success",
        description: "Domain created successfully",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  // Handle domain deletion
  const handleDelete = () => {
    if (!currentDomain) return;
    
    const updatedDomains = domains.filter(domain => domain.id !== currentDomain.id);
    setDomains(updatedDomains);
    filterDomains(searchTerm, statusFilter);
    
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Domain deleted successfully",
    });
  };
  
  return (
    <AdminLayout>
      <PageHeader
        title="Domains"
        description="Manage business domains for companies"
        actions={
          <Button onClick={() => openDialog()} className="bg-primary-light hover:bg-primary">
            <Plus size={16} className="mr-1" /> Add Domain
          </Button>
        }
      />
      
      <SearchFilter
        searchPlaceholder="Search domains..."
        onSearch={handleSearch}
        filters={[
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
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDomains.map((domain) => (
                <tr key={domain.id} className="hover:bg-gray-50">
                  <td className="pl-4 pr-6 py-3 whitespace-nowrap">
                    <span className="font-medium">{domain.name}</span>
                  </td>
                  <td>{domain.description}</td>
                  <td>
                    <StatusBadge status={domain.status} />
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openDialog(domain)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openDeleteDialog(domain)}
                        className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDomains.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No domains found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create/Edit Domain Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {currentDomain ? 'Edit Domain' : 'Add New Domain'}
            </DialogTitle>
            <DialogDescription>
              {currentDomain 
                ? 'Update the domain details below.'
                : 'Enter the domain details to add it to the platform.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Domain Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Enter domain name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description*</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Enter domain description"
                  className="mt-1"
                />
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
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-light hover:bg-primary">
                {currentDomain ? 'Update Domain' : 'Create Domain'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Domain</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentDomain?.name}? This action cannot be undone.
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

export default Domains; 