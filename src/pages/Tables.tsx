// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import AdminLayout from '@/components/layout/AdminLayout';
// import PageHeader from '@/components/ui/PageHeader';
// import { Button } from '@/components/ui/button';
// import { Plus, Pencil, Trash2 } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';
// import MonacoEditor from '@monaco-editor/react';
// import { RootState, AppDispatch } from '@/redux/store';
// import {
//   createTable,
//   updateTable,
//   deleteTable,
//   setFilters,
//   Table,
//   fetchDynamicTables,
// } from '@/redux/Slices/tableSlice';

// const Tables = () => {
//   const { toast } = useToast();
//   const dispatch = useDispatch<AppDispatch>();
//   const { tables, loading, error, filters } = useSelector((state: RootState) => state.table);
  
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [currentTable, setCurrentTable] = useState<Table | null>(null);
//   const [formData, setFormData] = useState<Partial<Table>>({
//     name: '',
//     query: '',
//     insertData: '',
//   });

//   // Fetch tables on component mount and when filters change
//   // useEffect(() => {
//   //   dispatch(fetchTables(filters));
//   // }, [dispatch, filters]);

//   // Fetch dynamic tables
//   useEffect(() => {
//     dispatch(fetchDynamicTables());
//   }, [dispatch]);

//   // Handle form data change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Open dialog for creating or editing a table
//   const openDialog = (table: Table | null = null) => {
//     if (table) {
//       setCurrentTable(table);
//       setFormData({
//         name: table.name,
//         query: table.query,
//         insertData: table.insertData,
//       });
//     } else {
//       setCurrentTable(null);
//       setFormData({
//         name: '',
//         query: '',
//         insertData: '',
//       });
//     }
//     setIsDialogOpen(true);
//   };

//   // Open delete confirmation dialog
//   const openDeleteDialog = (table: Table) => {
//     setCurrentTable(table);
//     setIsDeleteDialogOpen(true);
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.query) {
//       toast({
//         title: "Error",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     try {
//       if (currentTable) {
//         // Update existing table
//         await dispatch(updateTable({ id: currentTable.id, data: formData }));
//         toast({
//           title: "Success",
//           description: "Table updated successfully",
//         });
//       } else {
//         // Create new table
//         const resultAction = await dispatch(createTable({
//           name: formData.name || '',
//           query: formData.query || '',
//           insertData: formData.insertData || ''
//         }));

//         if (createTable.rejected.match(resultAction)) {
//           // Show backend error in toast
//           const errorMessage = typeof resultAction.payload === "string" 
//             ? resultAction.payload 
//             : "Failed to save table. Please check the console for details.";
            
//           console.error('Table creation failed:', resultAction.payload);
          
//           toast({
//             title: "Error",
//             description: errorMessage,
//             variant: "destructive",
//           });
//         } else {
//           toast({
//             title: "Success",
//             description: "Table created successfully",
//           });
//           dispatch(fetchDynamicTables());
//           setIsDialogOpen(false);
//         }
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to save table",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle table deletion
//   const handleDelete = async () => {
//     if (!currentTable) return;
    
//     try {
//       await dispatch(deleteTable(currentTable.id));
//       setIsDeleteDialogOpen(false);
//       toast({
//         title: "Success",
//         description: "Table deleted successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete table",
//         variant: "destructive",
//       });
//     }
//   };

//   const safeTables = Array.isArray(tables) ? tables : [];

//   return (
//     <AdminLayout>
//       <PageHeader
//         title="Tables"
//         description="Manage database tables"
//         actions={
//           <Button onClick={() => openDialog()} className="bg-primary-light hover:bg-primary">
//             <Plus size={16} className="mr-1" /> Create New Table
//           </Button>
//         }
//       />
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {loading ? (
//           <div className="col-span-full text-center py-8 text-gray-500">
//             Loading...
//           </div>
//         ) : error ? (
//           <div className="col-span-full text-center py-8 text-red-500">
//             {error}
//           </div>
//         ) : safeTables.length === 0 ? (
//           <div className="col-span-full text-center py-8 text-gray-500">
//             No tables found
//           </div>
//         ) : (
//           safeTables.map(table => (
//             <div key={table.id} className="data-card">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-medium">{table.name}</h3>
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button 
//                     variant="outline" 
//                     size="icon"
//                     onClick={() => openDialog(table)}
//                   >
//                     <Pencil size={16} />
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     size="icon"
//                     onClick={() => openDeleteDialog(table)}
//                     className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
//                   >
//                     <Trash2 size={16} />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
      
//       {/* Create/Edit Table Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {currentTable ? 'Edit Table' : 'Create New Table'}
//             </DialogTitle>
//             <DialogDescription>
//               {currentTable 
//                 ? 'Update the table details below.'
//                 : 'Enter the table details to create a new table.'
//               }
//             </DialogDescription>
//           </DialogHeader>
          
//           <form onSubmit={handleSubmit} className="space-y-4 py-4">
//             <div>
//               <Label htmlFor="name">Table Name*</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name || ''}
//                 onChange={handleChange}
//                 placeholder="Enter table name"
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <Label htmlFor="query">Table Query*</Label>
//               <div className="mt-1 overflow-hidden">
//                 <MonacoEditor
//                   height="200px"
//                   language="sql"
//                   theme="vs-light"
//                   value={formData.query || ''}
//                   onChange={(value) => setFormData(prev => ({ ...prev, query: value || '' }))}
//                   options={{
//                     minimap: { enabled: false },
//                     fontSize: 14,
//                     lineNumbers: 'on',
//                     roundedSelection: false,
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                   }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Write the CREATE TABLE query here. Example: CREATE TABLE table_name (column1 datatype, column2 datatype);
//               </p>
//             </div>

//             <div>
//               <Label htmlFor="insertData">Insert Data</Label>
//               <div className="mt-1 overflow-hidden">
//                 <MonacoEditor
//                   height="200px"
//                   language="sql"
//                   theme="vs-light"
//                   value={formData.insertData || ''}
//                   onChange={(value) => setFormData(prev => ({ ...prev, insertData: value || '' }))}
//                   options={{
//                     minimap: { enabled: false },
//                     fontSize: 14,
//                     lineNumbers: 'on',
//                     roundedSelection: false,
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                   }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Write the INSERT queries here. Example: INSERT INTO table_name (column1, column2) VALUES (value1, value2);
//               </p>
//             </div>
            
//             <DialogFooter>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setIsDialogOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-primary-light hover:bg-primary">
//                 {currentTable ? 'Update Table' : 'Create Table'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
      
//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-[450px]">
//           <DialogHeader>
//             <DialogTitle>Delete Table</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete "{currentTable?.name}"? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="mt-4">
//             <Button
//               variant="outline"
//               onClick={() => setIsDeleteDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDelete}
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </AdminLayout>
//   );
// };

// export default Tables; 

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
import MonacoEditor from '@monaco-editor/react';
import { RootState, AppDispatch } from '@/redux/store';
import {
  createTable,
  updateTable,
  deleteTable,
  fetchDynamicTables,
  Table,
} from '@/redux/Slices/tableSlice';

const Tables = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { tables, loading, error } = useSelector((state: RootState) => state.table);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<Partial<Table>>({
    name: '',
    query: '',
    insertData: '',
  });

  useEffect(() => {
    dispatch(fetchDynamicTables());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openDialog = (table: Table | null = null) => {
    if (table) {
      setCurrentTable(table);
      setFormData({
        name: table.name,
        query: table.query,
        insertData: table.insertData,
      });
    } else {
      setCurrentTable(null);
      setFormData({
        name: '',
        query: '',
        insertData: '',
      });
    }
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (table: Table) => {
    setCurrentTable(table);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.query) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (currentTable) {
        const isUnchanged =
          formData.name === currentTable.name &&
          formData.query === currentTable.query &&
          (formData.insertData || '') === (currentTable.insertData || '');

        if (isUnchanged) {
          toast({
            title: 'No Changes Detected',
            description: 'You have not made any changes.',
          });
          return;
        }

        const resultAction = await dispatch(updateTable({ id: currentTable.id, data: formData }));

        if (updateTable.rejected.match(resultAction)) {
          const errorMessage =
            typeof resultAction.payload === 'string'
              ? resultAction.payload
              : 'Failed to update table. Please check the console for details.';
          console.error('Table update failed:', resultAction.payload);
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Table updated successfully',
          });
          dispatch(fetchDynamicTables());
          setIsDialogOpen(false);
        }
      } else {
        const resultAction = await dispatch(
          createTable({
            name: formData.name || '',
            query: formData.query || '',
            insertData: formData.insertData || '',
          })
        );

        if (createTable.rejected.match(resultAction)) {
          const errorMessage =
            typeof resultAction.payload === 'string'
              ? resultAction.payload
              : 'Failed to create table. Please check the console for details.';
          console.error('Table creation failed:', resultAction.payload);
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Table created successfully',
          });
          dispatch(fetchDynamicTables());
          setIsDialogOpen(false);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save table',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!currentTable) return;

    try {
      await dispatch(deleteTable(currentTable.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Table deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete table',
        variant: 'destructive',
      });
    }
  };

  const safeTables = Array.isArray(tables) ? tables : [];

  return (
    <AdminLayout>
      <PageHeader
        title="Tables"
        description="Manage database tables"
        actions={
          <Button onClick={() => openDialog()} className="bg-primary-light hover:bg-primary">
            <Plus size={16} className="mr-1" /> Create New Table
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">{error}</div>
        ) : safeTables.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No tables found</div>
        ) : (
          safeTables.map(table => (
            <div key={table.id} className="data-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{table.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openDialog(table)}>
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDeleteDialog(table)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentTable ? 'Edit Table' : 'Create New Table'}</DialogTitle>
            <DialogDescription>
              {currentTable ? 'Update the table details below.' : 'Enter the table details to create a new table.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Table Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter table name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="query">Table Query*</Label>
              <div className="mt-1 overflow-hidden">
                <MonacoEditor
                  height="200px"
                  language="sql"
                  theme="vs-light"
                  value={formData.query || ''}
                  onChange={value => setFormData(prev => ({ ...prev, query: value || '' }))}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Write the CREATE TABLE query here. Example: CREATE TABLE table_name (column1 datatype, column2 datatype);
              </p>
            </div>

            <div>
              <Label htmlFor="insertData">Insert Data</Label>
              <div className="mt-1 overflow-hidden">
                <MonacoEditor
                  height="200px"
                  language="sql"
                  theme="vs-light"
                  value={formData.insertData || ''}
                  onChange={value => setFormData(prev => ({ ...prev, insertData: value || '' }))}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Write the INSERT queries here. Example: INSERT INTO table_name (column1, column2) VALUES (value1, value2);
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-light hover:bg-primary">
                {currentTable ? 'Update Table' : 'Create Table'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Table</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentTable?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Tables;
