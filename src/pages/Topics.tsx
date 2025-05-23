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
import { RootState, AppDispatch } from '@/redux/store';
import { 
  fetchTopics, 
  createTopic, 
  updateTopic, 
  deleteTopic,
  setFilters,
  Topic 
} from '@/redux/Slices/topicSlice';

const Topics = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading, error, filters } = useSelector((state: RootState) => state.topic);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState<Partial<Topic>>({
    name: '',
  });

  // Fetch topics on component mount and when filters change
  useEffect(() => {
    dispatch(fetchTopics(filters));
  }, [dispatch, filters]);

  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open dialog for creating or editing a topic
  const openDialog = (topic: Topic | null = null) => {
    if (topic) {
      setCurrentTopic(topic);
      setFormData({
        name: topic.name,
      });
    } else {
      setCurrentTopic(null);
      setFormData({
        name: '',
      });
    }
    setIsDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (topic: Topic) => {
    setCurrentTopic(topic);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a topic name",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (currentTopic) {
        // Update existing topic
        await dispatch(updateTopic({ id: currentTopic.id, data: formData }));
        toast({
          title: "Success",
          description: "Topic updated successfully",
        });
      } else {
        // Create new topic
        await dispatch(createTopic(formData));
        toast({
          title: "Success",
          description: "Topic created successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save topic",
        variant: "destructive",
      });
    }
  };

  // Handle topic deletion
  const handleDelete = async () => {
    if (!currentTopic) return;
    
    try {
      await dispatch(deleteTopic(currentTopic.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete topic",
        variant: "destructive",
      });
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Topics"
        description="Manage SQL question topics"
        actions={
          <Button onClick={() => openDialog()} className="bg-primary-light hover:bg-primary">
            <Plus size={16} className="mr-1" /> Add Topic
          </Button>
        }
      />
      
      <div className="flex mb-6">
        <div className="relative flex-grow max-w-md">
          <Input
            type="search"
            placeholder="Search topics..."
            className="pl-10"
            value={filters.search}
            onChange={handleSearch}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading...
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">
            {error}
          </div>
        ) : !Array.isArray(topics) || topics.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No topics found
          </div>
        ) : (
          topics.map(topic => (
            <div key={topic.id} className="data-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{topic.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => openDialog(topic)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => openDeleteDialog(topic)}
                    className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-medium bg-primary-lightest bg-opacity-30 px-2 py-1 rounded">
                    {topic.questionCount}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Create/Edit Topic Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {currentTopic ? 'Edit Topic' : 'Add New Topic'}
            </DialogTitle>
            <DialogDescription>
              {currentTopic 
                ? 'Update the topic name below.'
                : 'Enter the topic name to add it to the platform.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Topic Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter topic name"
                className="mt-1"
              />
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
                {currentTopic ? 'Update Topic' : 'Create Topic'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Topic</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentTopic?.name}"? This action cannot be undone.
              {currentTopic?.questionCount > 0 && (
                <div className="mt-2 text-red-500">
                  Warning: This topic has {currentTopic.questionCount} questions associated with it.
                </div>
              )}
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

export default Topics;
