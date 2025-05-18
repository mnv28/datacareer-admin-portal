import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import SearchFilter from '@/components/ui/SearchFilter';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Filter,
  Eye,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/RichTextEditor';

// Dummy data for questions
const initialQuestions = [
  {
    id: 1,
    title: 'Advanced SQL Joins',
    company: 'Google',
    type: 'MySQL',
    difficulty: 'Advanced',
    topic: 'Joins',
    status: 'active',
    content: 'Write a query to join multiple tables...',
    schema: 'Database schema information...',
    solution: 'SELECT * FROM table1 JOIN table2...',
  },
  {
    id: 2,
    title: 'Window Functions',
    company: 'Facebook',
    type: 'PostgreSQL',
    difficulty: 'Intermediate',
    topic: 'Window Functions',
    status: 'active',
    content: 'Use window functions to analyze...',
    schema: 'Database schema information...',
    solution: 'SELECT *, ROW_NUMBER() OVER...',
  },
  {
    id: 3,
    title: 'Recursive CTEs',
    company: 'Amazon',
    type: 'PostgreSQL',
    difficulty: 'Advanced',
    topic: 'CTE',
    status: 'inactive',
    content: 'Write a recursive CTE to...',
    schema: 'Database schema information...',
    solution: 'WITH RECURSIVE cte AS...',
  },
  {
    id: 4,
    title: 'User Analytics',
    company: 'Netflix',
    type: 'MySQL',
    difficulty: 'Intermediate',
    topic: 'Analytics',
    status: 'active',
    content: 'Analyze user behavior with...',
    schema: 'Database schema information...',
    solution: 'SELECT user_id, COUNT(*) FROM...',
  },
  {
    id: 5,
    title: 'Basic Filtering',
    company: 'Microsoft',
    type: 'MySQL',
    difficulty: 'Beginner',
    topic: 'Filtering',
    status: 'active',
    content: 'Filter data based on conditions...',
    schema: 'Database schema information...',
    solution: 'SELECT * FROM users WHERE...',
  },
  {
    id: 6,
    title: 'Advanced Indexing',
    company: 'Twitter',
    type: 'PostgreSQL',
    difficulty: 'Advanced',
    topic: 'Indexing',
    status: 'active',
    content: 'Create and use advanced indexes...',
    schema: 'Database schema information...',
    solution: 'CREATE INDEX idx_name ON...',
  },
];

// Filter options
const companyOptions = [
  { value: 'Google', label: 'Google' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Amazon', label: 'Amazon' },
  { value: 'Netflix', label: 'Netflix' },
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'Twitter', label: 'Twitter' },
];

const typeOptions = [
  { value: 'MySQL', label: 'MySQL' },
  { value: 'PostgreSQL', label: 'PostgreSQL' },
];

const difficultyOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const topicOptions = [
  { value: 'Joins', label: 'Joins' },
  { value: 'Window Functions', label: 'Window Functions' },
  { value: 'CTE', label: 'CTE' },
  { value: 'Analytics', label: 'Analytics' },
  { value: 'Filtering', label: 'Filtering' },
  { value: 'Indexing', label: 'Indexing' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface Question {
  id: number;
  title: string;
  company: string;
  type: string;
  difficulty: string;
  topic: string;
  status: string;
  content: string;
  schema: string;
  schemaImage?: string;
  solution: string;
}

const Questions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(initialQuestions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({
    title: '',
    company: '',
    type: 'MySQL',
    difficulty: 'Beginner',
    topic: '',
    status: 'active',
    content: '',
    schema: '',
    schemaImage: '',
    solution: '',
  });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Additional state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search and filter questions
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterQuestions(term, companyFilter, typeFilter, difficultyFilter, statusFilter);
  };
  
  const handleCompanyFilter = (company: string) => {
    setCompanyFilter(company);
    filterQuestions(searchTerm, company, typeFilter, difficultyFilter, statusFilter);
  };
  
  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    filterQuestions(searchTerm, companyFilter, type, difficultyFilter, statusFilter);
  };
  
  const handleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(difficulty);
    filterQuestions(searchTerm, companyFilter, typeFilter, difficulty, statusFilter);
  };
  
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterQuestions(searchTerm, companyFilter, typeFilter, difficultyFilter, status);
  };
  
  const filterQuestions = (
    term: string,
    company: string,
    type: string,
    difficulty: string,
    status: string
  ) => {
    let filtered = [...questions];
    
    if (term) {
      filtered = filtered.filter(question => 
        question.title.toLowerCase().includes(term.toLowerCase()) ||
        question.topic.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (company) {
      filtered = filtered.filter(question => question.company === company);
    }
    
    if (type) {
      filtered = filtered.filter(question => question.type === type);
    }
    
    if (difficulty) {
      filtered = filtered.filter(question => question.difficulty === difficulty);
    }
    
    if (status) {
      filtered = filtered.filter(question => question.status === status);
    }
    
    setFilteredQuestions(filtered);
  };
  
  // Handle form data change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData(prev => ({ ...prev, schemaImage: imageUrl }));
    }
  };
  
  // Open dialog for creating or editing a question
  const openDialog = (question: Question | null = null) => {
    if (question) {
      setCurrentQuestion(question);
      setFormData({
        title: question.title,
        company: question.company,
        type: question.type,
        difficulty: question.difficulty,
        topic: question.topic,
        status: question.status,
        content: question.content,
        schema: question.schema,
        schemaImage: question.schemaImage,
        solution: question.solution,
      });
    } else {
      setCurrentQuestion(null);
      setFormData({
        title: '',
        company: '',
        type: 'MySQL',
        difficulty: 'Beginner',
        topic: '',
        status: 'active',
        content: '',
        schema: '',
        schemaImage: '',
        solution: '',
      });
    }
    setIsDialogOpen(true);
  };
  
  // Open preview dialog
  const openPreviewDialog = (question: Question) => {
    setCurrentQuestion(question);
    setIsPreviewDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (question: Question) => {
    setCurrentQuestion(question);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Check if content is empty or only contains whitespace/HTML tags
    const isContentEmpty = !formData.content || formData.content.replace(/<[^>]*>/g, '').trim() === '';
    
    if (!formData.title || !formData.company || !formData.topic || isContentEmpty) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (currentQuestion) {
      // Update existing question
      const updatedQuestions = questions.map(question => 
        question.id === currentQuestion.id ? { ...question, ...formData } : question
      );
      setQuestions(updatedQuestions);
      filterQuestions(searchTerm, companyFilter, typeFilter, difficultyFilter, statusFilter);
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
    } else {
      // Create new question
      const newQuestion = {
        id: questions.length + 1,
        title: formData.title!,
        company: formData.company!,
        type: formData.type || 'MySQL',
        difficulty: formData.difficulty || 'Beginner',
        topic: formData.topic!,
        status: formData.status || 'active',
        content: formData.content!,
        schema: formData.schema || '',
        schemaImage: formData.schemaImage,
        solution: formData.solution || '',
      };
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
      toast({
        title: "Success",
        description: "Question created successfully",
      });
    }
    
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };
  
  // Handle question deletion
  const handleDelete = () => {
    if (!currentQuestion) return;
    
    const updatedQuestions = questions.filter(question => question.id !== currentQuestion.id);
    setQuestions(updatedQuestions);
    filterQuestions(searchTerm, companyFilter, typeFilter, difficultyFilter, statusFilter);
    
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Question deleted successfully",
    });
  };
  
  // Update the dialog close handler
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };
  
  return (
    <AdminLayout>
      <PageHeader
        title="Questions"
        description="Manage SQL practice questions"
        actions={
          <Button onClick={() => openDialog()} className="bg-primary-light hover:bg-primary">
            <Plus size={16} className="mr-1" /> Add Question
          </Button>
        }
      />
      
      <SearchFilter
        searchPlaceholder="Search questions..."
        onSearch={handleSearch}
        filters={[
          {
            name: "Company",
            options: companyOptions,
            value: companyFilter,
            onChange: handleCompanyFilter,
          },
          {
            name: "Type",
            options: typeOptions,
            value: typeFilter,
            onChange: handleTypeFilter,
          },
          {
            name: "Difficulty",
            options: difficultyOptions,
            value: difficultyFilter,
            onChange: handleDifficultyFilter,
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
                <th>Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="font-medium">{question.title}</td>
                  <td>{question.company}</td>
                  <td>{question.type}</td>
                  <td>
                    <StatusBadge status={question.difficulty.toLowerCase()} />
                  </td>
                  <td>{question.topic}</td>
                  <td>
                    <StatusBadge status={question.status} />
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openPreviewDialog(question)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openDialog(question)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openDeleteDialog(question)}
                        className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No questions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create/Edit Question Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentQuestion ? 'Edit Question' : 'Add New Question'}
            </DialogTitle>
            <DialogDescription>
              {currentQuestion 
                ? 'Update the question details below.'
                : 'Enter the question details to add it to the platform.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Question Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  placeholder="Enter question title"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company*</Label>
                  <select
                    id="company"
                    name="company"
                    value={formData.company || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select company</option>
                    {companyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="topic">Topic*</Label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select topic</option>
                    {topicOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">DB Type</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type || 'MySQL'}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty || 'Beginner'}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    {difficultyOptions.map(option => (
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
            </div>
            
            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="content">Question Content</TabsTrigger>
                <TabsTrigger value="schema">Schema/ERD</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-4">
                <Label htmlFor="content">Question Content*</Label>
                <RichTextEditor
                  content={formData.content || ''}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your content. You can add tables, lists, and apply various text styles.
                </p>
              </TabsContent>
              
              <TabsContent value="schema" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schema">Database Schema/ERD</Label>
                    <RichTextEditor
                      content={formData.schema || ''}
                      onChange={(content) => setFormData(prev => ({ ...prev, schema: content }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use the toolbar above to format your schema content. You can add tables, lists, and apply various text styles.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="schemaImage">Schema/ERD Image</Label>
                    <div className="mt-1 flex items-center gap-4">
                      <Input
                        id="schemaImage"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      {formData.schemaImage && (
                        <div className="relative w-20 h-20">
                          <img
                            src={formData.schemaImage}
                            alt="Schema preview"
                            className="w-full h-full object-contain border rounded-md"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-sm"
                            onClick={() => setFormData(prev => ({ ...prev, schemaImage: '' }))}
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
              </TabsContent>
              
              <TabsContent value="solution" className="mt-4">
                <Label htmlFor="solution">Sample Solution</Label>
                <RichTextEditor
                  content={formData.solution || ''}
                  onChange={(content) => setFormData(prev => ({ ...prev, solution: content }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your solution. You can add tables, lists, and apply various text styles. For SQL code, you can use the code formatting options.
                </p>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-light hover:bg-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : currentQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Preview Question Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentQuestion?.title}
            </DialogTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge status={currentQuestion?.difficulty.toLowerCase() || ''} />
              <span className="status-badge bg-gray-100 text-gray-800">
                {currentQuestion?.type}
              </span>
              <span className="status-badge bg-blue-100 text-blue-800">
                {currentQuestion?.company}
              </span>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="content">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="content">Question</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="mt-4">
              <div className="p-4 border rounded-md bg-white">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.content || '' }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="schema" className="mt-4">
              <div className="p-4 border rounded-md bg-white">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.schema || 'No schema information provided.' }}
                />
                {currentQuestion?.schemaImage && (
                  <div className="mt-4">
                    <img
                      src={currentQuestion.schemaImage}
                      alt="Schema diagram"
                      className="max-w-full h-auto rounded-md border"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="solution" className="mt-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <div 
                  className="prose max-w-none font-mono text-sm"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.solution || 'No solution provided.' }}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsPreviewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentQuestion?.title}"? This action cannot be undone.
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

export default Questions;
