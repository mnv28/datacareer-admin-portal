import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
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
import RichTextEditor from '@/components/RichTextEditor';
import { RootState, AppDispatch } from '@/redux/store';
import {
  fetchDatabases,
  createDatabase,
  updateDatabase,
  deleteDatabase,
  setFilters,
  Database,
  fetchDatabaseById,
} from '@/redux/Slices/databaseSlice';
import { fetchDynamicTables } from '@/redux/Slices/tableSlice';

const DatabasePage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { databases, loading, error, filters } = useSelector((state: RootState) => state.database);
  const { tables } = useSelector((state: RootState) => state.table);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDatabase, setCurrentDatabase] = useState<Database | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Database>>({
    name: '',
    tables: [],
    schemaContent: '',
    schemaImage: null,
  });

  // Fetch databases on component mount and when filters change
  useEffect(() => {
    dispatch(fetchDatabases(filters));
  }, [dispatch, filters]);

  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, schemaImage: file }));
    }
  };

  // Handle table selection
  const handleTableSelect = (value: string) => {
    const tableId = parseInt(value);
    setFormData(prev => ({
      ...prev,
      tables: prev.tables?.includes(tableId)
        ? prev.tables.filter(id => id !== tableId)
        : [...(prev.tables || []), tableId]
    }));
  };


  const openDialog = async (database: Database | null = null) => {
    dispatch(fetchDynamicTables());
    if (database) {
      // Fetch the latest data for this database
      const result = await dispatch(fetchDatabaseById(database.id)).unwrap();
      setCurrentDatabase({
        id: result.id,
        name: result.databaseName,
        tables: result.tables.map((t: any) => t.id),
        schemaContent: result.schemaContent,
        schemaImage: result.schemaImageUrl,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
      setFormData({
        name: result.databaseName,
        tables: result.tables.map((t: any) => t.id),
        schemaContent: result.schemaContent,
        schemaImage: result.schemaImageUrl,
      });
    } else {
      setCurrentDatabase(null);
      setFormData({
        name: '',
        tables: [],
        schemaContent: '',
        schemaImage: null,
      });
    }
    setIsDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (database: Database) => {
    setCurrentDatabase(database);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.tables?.length || !formData.schemaContent) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (currentDatabase) {
        // Update existing database
        await dispatch(updateDatabase({ id: currentDatabase.id, data: formData })).unwrap();
        toast({
          title: "Success",
          description: "Database updated successfully",
        });
        dispatch(fetchDatabases(filters));
      } else {
        // Create new database
        await dispatch(createDatabase(formData)).unwrap();
        toast({
          title: "Success",
          description: "Database created successfully",
        });
        dispatch(fetchDatabases(filters));
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save database",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle database deletion
  const handleDelete = async () => {
    if (!currentDatabase) return;

    try {
      await dispatch(deleteDatabase(currentDatabase.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Database deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete database",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Databases"
        description="Manage database schemas and relationships"
        actions={
          <Button onClick={() => openDialog()} className="bg-primary-light hover:bg-primary">
            <Plus size={16} className="mr-1" /> Create New Database
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading...
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">
            {error}
          </div>
        ) : databases.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No databases found
          </div>
        ) : (
          databases.map(database => (
            <div key={database.id} className="data-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{database.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {database.tables.length} tables
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDialog(database)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDeleteDialog(database)}
                    className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Database Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentDatabase ? 'Edit Database' : 'Create New Database'}
            </DialogTitle>
            <DialogDescription>
              {currentDatabase
                ? 'Update the database details below.'
                : 'Enter the database details to create a new database.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Database Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter database name"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Select Tables*</Label>
              <div className="mt-1 space-y-2">
                {tables.map(table => (
                  <div key={table.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`table-${table.id}`}
                      checked={formData.tables?.includes(table.id)}
                      onChange={() => handleTableSelect(table.id.toString())}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`table-${table.id}`} className="text-sm">
                      {table.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="schemaContent">Schema Content*</Label>
              <div className="mt-1">
                <RichTextEditor
                  content={formData.schemaContent || ''}
                  onChange={(content) => setFormData(prev => ({ ...prev, schemaContent: content }))}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use the toolbar above to format your schema content. You can add tables, lists, and apply various text styles.
              </p>
            </div>

            <div>
              <Label htmlFor="schemaImage">Schema/ERD Image</Label>
              {

                (formData.schemaImage && typeof formData.schemaImage === 'string') ? (formData.schemaImage.startsWith("http://")) ? formData.schemaImage = formData.schemaImage.replace('http://', 'https://') : '' : ''
                
              }
              {formData.schemaImage && typeof formData.schemaImage === 'string' && (
                <img
                  src={formData.schemaImage.replace('http://', 'https://')}
                  alt="Schema/ERD"
                  style={{ maxWidth: '50px', marginBottom: '10px' }}
                />
              )}
              <Input
                id="schemaImage"
                name="schemaImage"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload an ERD or schema diagram image (optional).
              </p>
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
              <Button type="submit"
                className="bg-primary-light hover:bg-primary"
                disabled={isSubmitting}>
                {
                  isSubmitting
                    ? (currentDatabase ? "Updating...." : "Creating...")
                    : (currentDatabase ? 'Update Database' : 'Create Database')
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
            <DialogTitle>Delete Database</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentDatabase?.name}"? This action cannot be undone.
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

export default DatabasePage; 