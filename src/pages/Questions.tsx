import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { RootState, AppDispatch } from '@/redux/store';
import {
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  setFilters,
  Question
} from '@/redux/Slices/questionSlice';
import { fetchCompanies } from '@/redux/Slices/companySlice';
import { fetchTopics } from '@/redux/Slices/topicSlice';
import MonacoEditor from '@monaco-editor/react';
import { log } from 'console';
import { fetchDatabases } from '@/redux/Slices/databaseSlice';

// Filter options
const typeOptions = [
  { value: 'MySQL', label: 'MySQL' },
  { value: 'PostgreSQL', label: 'PostgreSQL' },
];

const difficultyOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const Questions = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { questions, loading, error, filters } = useSelector((state: RootState) => state.question);
  const { companies } = useSelector((state: RootState) => state.company);
  const { topics } = useSelector((state: RootState) => state.topic);
  const { databases, loading: databasesLoading } = useSelector((state: RootState) => state.database);

  // console.log("tables = ",tables)
  console.log("databases = ", databases);


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  console.log("currentQuestion?.query =", currentQuestion);

  const [formData, setFormData] = useState<Partial<Question>>({
    title: '',
    companyId: 0,
    topicId: 0,
    dbType: 'MySQL',
    difficulty: 'Beginner',
    status: 'active',
    questionContent: '',
    // schemaContent: '',
    // schemaImage: null,
    solution: '',
    // createTableQuery: '',
    // addDataQuery: '',
    solutionQuery: '',
    dynamicTableInfoId: '',
  });
console.log("formData = ",formData);

  // Additional state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions, companies and topics on component mount
  useEffect(() => {
    dispatch(fetchQuestions(filters));
    dispatch(fetchCompanies({}));
    dispatch(fetchTopics({}));
    dispatch(fetchDatabases(filters));
  }, [dispatch, filters]);

  // Search and filter questions
  const handleSearch = (term: string) => {
    dispatch(setFilters({ search: term }));
  };

  const handleCompanyFilter = (companyId: string) => {
    dispatch(setFilters({ companyId }));
  };

  const handleTypeFilter = (dbType: string) => {
    dispatch(setFilters({ dbType }));
  };

  const handleDifficultyFilter = (difficulty: string) => {
    dispatch(setFilters({ difficulty }));
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status }));
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

      // Store the actual file object for form submission
      setFormData(prev => ({ ...prev, schemaImage: file }));
    }
  };

  // Helper function to check if value is a File object
  const isFile = (value: unknown): value is File => {
    return value instanceof File;
  };

  // Helper function to get image URL
  const getImageUrl = (image: string | File | null): string => {
    if (!image) return '';
    if (isFile(image)) return URL.createObjectURL(image);
    return image as string;
  };

  // Open dialog for creating or editing a question
  const openDialog = async (question: Question | null = null) => {

    if (question) {
      setCurrentQuestion(question);
      // try {
      //   const queryData = JSON.parse(question.query);
      //   console.log("queryData ===",queryData);
      
      //   solutionQuery = queryData.solutionQuery || '';
      // } catch (e) {
      //   // If parsing fails, use the query as is
      //   createTableQuery = question.query;
      // }

      setFormData({
        ...question,
        solutionQuery: question.solutionQuery,
        dynamicTableInfoId: question.dynamicTableInfoId || '',
      });
    } else {
      setCurrentQuestion(null);
      setFormData({
        title: '',
        companyId: 0,
        topicId: 0,
        dbType: 'MySQL',
        difficulty: 'Beginner',
        status: 'active',
        questionContent: '',
        // schemaContent: '',
        // schemaImage: null,
        solution: '',
        // createTableQuery: '',
        // addDataQuery: '',
        solutionQuery: '',
        dynamicTableInfoId: '',
      });
    }
    // dispatch(fetchQuestions(filters));
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if content is empty or only contains whitespace/HTML tags
    const isContentEmpty = !formData.questionContent || formData.questionContent.replace(/<[^>]*>/g, '').trim() === '';

    if (!formData.title || !formData.companyId || !formData.topicId || isContentEmpty || !formData.dynamicTableInfoId) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('companyId', formData.companyId.toString());
      formDataToSubmit.append('topicId', formData.topicId.toString());
      formDataToSubmit.append('dbType', formData.dbType);
      formDataToSubmit.append('difficulty', formData.difficulty.toLowerCase());
      formDataToSubmit.append('questionContent', formData.questionContent);
      formDataToSubmit.append('dynamicTableInfoId', formData.dynamicTableInfoId);
      // formDataToSubmit.append('schemaContent', formData.schemaContent);
      // if (formData.schemaImage && isFile(formData.schemaImage)) {
      //   formDataToSubmit.append('schemaImage', formData.schemaImage);
      // }
      formDataToSubmit.append('solution', formData.solution);

      // Combine the queries into JSON format
      // const queryJson = {
      //   createTable: formData.createTableQuery || '',
      //   addData: formData.addDataQuery || ''
      // };
      // formDataToSubmit.append('query', JSON.stringify(queryJson));

      // Add solutionQuery as a separate form field
      if (formData.solutionQuery) {
        formDataToSubmit.append('solutionQuery', formData.solutionQuery);
      }

      if (currentQuestion) {
        // Update existing question
        await dispatch(updateQuestion({ id: currentQuestion.id, data: formDataToSubmit }));
        toast({
          title: "Success",
          description: "Question updated successfully",
        });
      } else {
        console.log("formDataToSubmit = ", formDataToSubmit);
        // Create new question
        await dispatch(createQuestion(formDataToSubmit));
        toast({
          title: "Success",
          description: "Question created successfully",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle question deletion
  const handleDelete = async () => {
    if (!currentQuestion) return;

    try {
      await dispatch(deleteQuestion(currentQuestion.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive",
      });
    }
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
            options: companies.map(company => ({ value: company.id.toString(), label: company.name })),
            value: filters.companyId || '',
            onChange: handleCompanyFilter,
          },
          {
            name: "Type",
            options: typeOptions,
            value: filters.dbType || '',
            onChange: handleTypeFilter,
          },
          {
            name: "Difficulty",
            options: difficultyOptions,
            value: filters.difficulty || '',
            onChange: handleDifficultyFilter,
          },
          {
            name: "Status",
            options: statusOptions,
            value: filters.status,
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
                <th>Dynamic Table</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No questions found
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="font-medium">{question.title}</td>
                    <td>{question.company?.name || 'N/A'}</td>
                    <td>{question.dbType}</td>
                    <td>
                      <StatusBadge status={question.difficulty.toLowerCase()} />
                    </td>
                    <td>{question.topic?.name || 'N/A'}</td>
                    <td>
                      {question.dynamicTableInfo?.databaseName || 'N/A'}
                    </td>
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
                ))
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
                  <Label htmlFor="companyId">Company*</Label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="topicId">Topic*</Label>
                  <select
                    id="topicId"
                    name="topicId"
                    value={formData.topicId || ''}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select topic</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dbType">DB Type</Label>
                  <select
                    id="dbType"
                    name="dbType"
                    value={formData.dbType || 'MySQL'}
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

              <div>
                <Label htmlFor="dynamicTableInfoId">Dynamic Table Information*</Label>
                <select
                  id="dynamicTableInfoId"
                  name="dynamicTableInfoId"
                  value={formData.dynamicTableInfoId || ''}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  required
                >
                  <option value="" disabled>Select table</option>
                  {databases.map(database => (
                    <option key={database.id} value={database.id}>
                      {database.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="content">Question Content</TabsTrigger>
                {/* <TabsTrigger value="schema">Schema/ERD</TabsTrigger>
                <TabsTrigger value="queries">Queries</TabsTrigger> */}
                <TabsTrigger value="solution">Solution</TabsTrigger>
                {/* <TabsTrigger value='solutionQuery'>Solution Query</TabsTrigger> */}
              </TabsList>

              <TabsContent value="content" className="mt-4">
                <Label htmlFor="questionContent">Question Content*</Label>
                <RichTextEditor
                  content={formData.questionContent || ''}
                  onChange={(content) => setFormData(prev => ({ ...prev, questionContent: content }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above to format your content. You can add tables, lists, and apply various text styles.
                </p>
              </TabsContent>




              <TabsContent value="solution" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="solution">Sample Solution</Label>
                    <div className="mt-1 overflow-hidden">
                      <RichTextEditor
                        content={formData.solution || ''}
                        onChange={(content) => setFormData(prev => ({ ...prev, solution: content }))}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Use the toolbar above to format your solution. You can add tables, lists, and apply various text styles. For SQL code, you can use the code formatting options.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="solutionQuery">Solution Query</Label>
                    <div className="mt-1 overflow-hidden">
                      <MonacoEditor
                        height="200px"
                        language="sql"
                        theme="vs-light"
                        value={formData.solutionQuery || ''}
                        onChange={(value) => setFormData(prev => ({ ...prev, solutionQuery: value || '' }))}
                      />
                    </div>
                  </div>
                </div>
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
      {/* <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentQuestion?.title}
            </DialogTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge status={currentQuestion?.difficulty.toLowerCase() || ''} />
              <span className="status-badge bg-gray-100 text-gray-800">
                {currentQuestion?.dbType}
              </span>
              <span className="status-badge bg-blue-100 text-blue-800">
                {currentQuestion?.companyId}
              </span>
            </div>
          </DialogHeader>

          <Tabs defaultValue="content">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="content">Question</TabsTrigger>
           
              <TabsTrigger value="solution">Solution</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4">
              <div className="p-4 border rounded-md bg-white">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.questionContent || '' }}
                />
              </div>
            </TabsContent>

            <TabsContent value="schema" className="mt-4">
              <div className="p-4 border rounded-md bg-white">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.dynamicTableInfo?.schemaContent || 'No schema information provided.' }}
                />
                {currentQuestion?.dynamicTableInfo?.schemaImageUrl && (
                  <div className="mt-4">
                    <img
                      src={currentQuestion.dynamicTableInfo.schemaImageUrl}
                      alt="Schema"
                      className="max-w-full h-auto rounded-md border"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="queries" className="mt-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {currentQuestion?.query || 'No queries provided.'}
                </pre>
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
      </Dialog> */}

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentQuestion?.title}
            </DialogTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge status={currentQuestion?.difficulty.toLowerCase() || ''} />
              <span className="status-badge bg-gray-100 text-gray-800">
                {currentQuestion?.dbType}
              </span>
              <span className="status-badge bg-blue-100 text-blue-800">
                {currentQuestion?.companyId}
              </span>
            </div>
          </DialogHeader>

          <Tabs defaultValue="content">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="content">Question</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="queries">Solution Query</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4">
              <div className="p-4 border rounded-md bg-white">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.questionContent || '' }}
                />
              </div>
            </TabsContent>

            <TabsContent value="schema" className="mt-4">
              <div className="p-4 border rounded-md bg-white">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion?.dynamicTableInfo?.schemaContent || 'No schema information provided.' }}
                />
                {currentQuestion?.schemaImage && (
                  <div className="mt-4">
                    <img
                      src={getImageUrl(currentQuestion.schemaImage)}
                      alt="Schema diagram"
                      className="max-w-full h-auto rounded-md border"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="queries" className="mt-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {currentQuestion?.solutionQuery || 'No queries provided.'}
                </pre>
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
