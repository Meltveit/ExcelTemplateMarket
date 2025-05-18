import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Template } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import useAuth from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import TemplateForm from '@/components/admin/TemplateForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  Trash2, 
  MoreVertical, 
  Plus, 
  Search,
  Loader2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminTemplates = () => {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/admin/templates'],
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/templates/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Template deleted',
        description: 'The template has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      setTemplateToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete template.',
        variant: 'destructive',
      });
    },
  });

  if (authLoading || templatesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, don't render anything (we'll redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Filter templates based on search term
  const filteredTemplates = templates?.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'financial': 'Financial',
      'project_management': 'Project Management',
      'hr_payroll': 'HR & Payroll',
      'marketing': 'Marketing',
      'operations': 'Operations'
    };
    
    return labels[category] || category;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'financial': 'bg-secondary',
      'project_management': 'bg-green-500',
      'hr_payroll': 'bg-purple-500',
      'marketing': 'bg-red-500',
      'operations': 'bg-blue-500'
    };
    
    return colors[category] || 'bg-gray-500';
  };

  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      deleteMutation.mutate(templateToDelete.id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Templates - Admin Dashboard - ExcelTemplates</title>
      </Helmet>

      <AdminLayout title="Templates">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Manage Templates</CardTitle>
            <CardDescription>Add, edit, or remove Excel templates from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
              <Button onClick={() => setShowNewForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Template
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates && filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(template.category)} text-white`}>
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>${template.price.toFixed(2)}</TableCell>
                      <TableCell>{template.downloadCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/templates/${template.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTemplateToEdit(template)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setTemplateToDelete(template)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      {searchTerm ? 'No templates match your search.' : 'No templates found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New Template Form */}
        {showNewForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Template</CardTitle>
              <CardDescription>Create a new Excel template for your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateForm />
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Template Dialog */}
        {templateToEdit && (
          <Dialog open={!!templateToEdit} onOpenChange={() => setTemplateToEdit(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Template</DialogTitle>
                <DialogDescription>
                  Make changes to the template information.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 max-h-[70vh] overflow-y-auto py-4">
                <TemplateForm 
                  templateId={templateToEdit.id} 
                  defaultValues={templateToEdit}
                  isEdit={true}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the template "{templateToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setTemplateToDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteTemplate}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>Delete Template</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </>
  );
};

export default AdminTemplates;
