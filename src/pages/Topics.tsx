
import React, { useState } from 'react';
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

// Dummy data for topics
const initialTopics = [
  { id: 1, name: 'Joins', relatedDomain: 'Data Retrieval', questionCount: 12 },
  { id: 2, name: 'Window Functions', relatedDomain: 'Analytics', questionCount: 8 },
  { id: 3, name: 'CTE', relatedDomain: 'Advanced Queries', questionCount: 5 },
  { id: 4, name: 'Analytics', relatedDomain: 'Business Intelligence', questionCount: 15 },
  { id: 5, name: 'Filtering', relatedDomain: 'Data Retrieval', questionCount: 20 },
  { id: 6, name: 'Indexing', relatedDomain: 'Performance', questionCount: 6 },
  { id: 7, name: 'Aggregation', relatedDomain: 'Data Summarization', questionCount: 9 },
  { id: 8, name: 'Subqueries', relatedDomain: 'Advanced Queries', questionCount: 11 },
];

const domainOptions = [
  'Data Retrieval',
  'Analytics',
  'Advanced Queries',
  'Business Intelligence',
  'Performance',
  'Data Summarization',
  'Data Modeling',
  'Transactions',
];

interface Topic {
  id: number;
  name: string;
  relatedDomain: string;
  questionCount: number;
}

const Topics = () => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState<Partial<Topic>>({
    name: '',
    relatedDomain: '',
  });

  // Filtered topics based on search
  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.relatedDomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open dialog for creating or editing a topic
  const openDialog = (topic: Topic | null = null) => {
    if (topic) {
      setCurrentTopic(topic);
      setFormData({
        name: topic.name,
        relatedDomain: topic.relatedDomain,
      });
    } else {
      setCurrentTopic(null);
      setFormData({
        name: '',
        relatedDomain: '',
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.relatedDomain) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (currentTopic) {
      // Update existing topic
      const updatedTopics = topics.map(topic => 
        topic.id === currentTopic.id ? { ...topic, ...formData } : topic
      );
      setTopics(updatedTopics);
      toast({
        title: "Success",
        description: "Topic updated successfully",
      });
    } else {
      // Create new topic
      const newTopic = {
        id: topics.length + 1,
        name: formData.name!,
        relatedDomain: formData.relatedDomain!,
        questionCount: 0,
      };
      const updatedTopics = [...topics, newTopic];
      setTopics(updatedTopics);
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
    }
    
    setIsDialogOpen(false);
  };

  // Handle topic deletion
  const handleDelete = () => {
    if (!currentTopic) return;
    
    const updatedTopics = topics.filter(topic => topic.id !== currentTopic.id);
    setTopics(updatedTopics);
    
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Topic deleted successfully",
    });
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map(topic => (
          <div key={topic.id} className="data-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{topic.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{topic.relatedDomain}</p>
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
        ))}
        
        {filteredTopics.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No topics found matching your search
          </div>
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
                ? 'Update the topic details below.'
                : 'Enter the topic details to add it to the platform.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
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
              
              <div>
                <Label htmlFor="relatedDomain">Related Domain*</Label>
                <select
                  id="relatedDomain"
                  name="relatedDomain"
                  value={formData.relatedDomain || ''}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="" disabled>Select related domain</option>
                  {domainOptions.map(domain => (
                    <option key={domain} value={domain}>
                      {domain}
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
