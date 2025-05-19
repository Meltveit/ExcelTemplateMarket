import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertTemplateSchema, Template } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import TemplatePreview from './TemplatePreview';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import { 
  Loader2, 
  Upload, 
  FileSpreadsheet, 
  Image as ImageIcon,
  Check, 
  X
} from 'lucide-react';

interface TemplateFormProps {
  templateId?: number;
  defaultValues?: any;
  isEdit?: boolean;
}

// Extended schema with more validation rules
const formSchema = insertTemplateSchema.extend({
  name: z.string().min(5, "Name must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive("Price must be positive")
  ),
  features: z.string().transform(str => 
    str.split('\n').filter(line => line.trim() !== '')
  ),
  compatibility: z.string().transform(str => 
    str.split('\n').filter(line => line.trim() !== '')
  ),
  thumbnails: z.string().transform(str => 
    str.split('\n').filter(line => line.trim() !== '')
  ),
  stripeProductId: z.string().nullable().optional().transform(val => val || null),
  stripePriceId: z.string().nullable().optional().transform(val => val || null),
});

const TemplateForm = ({ templateId, defaultValues, isEdit = false }: TemplateFormProps) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [templateUploadError, setTemplateUploadError] = useState('');
  const [imageUploadError, setImageUploadError] = useState('');
  const templateFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = useState<Partial<Template>>(defaultValues || {});
  const [templateData, setTemplateData] = useState<{
    fileData?: string;
    fileSize?: number;
    fileType?: string;
    originalName?: string;
  }>({});

  // Transform array fields into string for editing
  const prepareDefaultValues = (values: any) => {
    if (!values) return undefined;
    
    return {
      ...values,
      features: values.features?.join('\n') || '',
      compatibility: values.compatibility?.join('\n') || '',
      thumbnails: values.thumbnails?.join('\n') || '',
    };
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: prepareDefaultValues(defaultValues) || {
      name: '',
      description: '',
      detailedDescription: '',
      features: '',
      price: '',
      category: 'financial',
      mainImage: '',
      thumbnails: '',
      compatibility: '',
      stripeProductId: '',
      stripePriceId: '',
      filePath: '',
    },
  });
  
  // Update preview data whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Convert string arrays back to arrays for preview
      const formattedPreview: Partial<Template> = {
        ...value as any,
        features: typeof value.features === 'string' 
          ? value.features.split('\n').filter((line: string) => line.trim() !== '') 
          : value.features,
        compatibility: typeof value.compatibility === 'string' 
          ? value.compatibility.split('\n').filter((line: string) => line.trim() !== '') 
          : value.compatibility,
        thumbnails: typeof value.thumbnails === 'string' 
          ? value.thumbnails.split('\n').filter((line: string) => line.trim() !== '') 
          : value.thumbnails,
        price: typeof value.price === 'string' && value.price ? parseFloat(value.price) : value.price
      };
      setPreviewData(formattedPreview);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Handle template file upload
  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setTemplateUploadError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setIsUploadingTemplate(true);
    setTemplateUploadError('');

    try {
      const formData = new FormData();
      formData.append('template', file);

      const response = await fetch('/api/admin/upload/template', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123')
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload template file');
      }

      const data = await response.json();
      if (data.success) {
        // Store both the path and the file data
        form.setValue('filePath', data.filePath);
        
        // Store additional file information in form state for database storage
        // These will be used when submitting the form
        setTemplateData({
          fileData: data.fileData,
          fileSize: data.fileSize,
          fileType: data.fileType,
          originalName: data.originalName
        });
        
        toast({
          title: "Template Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      }
    } catch (error: any) {
      setTemplateUploadError(error.message || 'Error uploading template');
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload template file.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingTemplate(false);
    }
  };

  // Handle image file upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type is an image
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please upload an image file');
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin123')
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image file');
      }

      const data = await response.json();
      if (data.success) {
        form.setValue('mainImage', data.filePath);
        toast({
          title: "Image Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      }
    } catch (error: any) {
      setImageUploadError(error.message || 'Error uploading image');
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image file.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const triggerTemplateFileUpload = () => {
    if (templateFileInputRef.current) {
      templateFileInputRef.current.click();
    }
  };

  const triggerImageFileUpload = () => {
    if (imageFileInputRef.current) {
      imageFileInputRef.current.click();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Add file data to the form values
      const formDataWithFiles = {
        ...values,
        // Include file data if available
        ...(templateData.fileData && {
          fileData: templateData.fileData,
          fileSize: templateData.fileSize,
          fileType: templateData.fileType
        })
      };
      
      if (isEdit && templateId) {
        await apiRequest('PUT', `/api/admin/templates/${templateId}`, formDataWithFiles);
        toast({
          title: "Template updated",
          description: "The template has been successfully updated.",
        });
      } else {
        await apiRequest('POST', '/api/admin/templates', formDataWithFiles);
        toast({
          title: "Template created",
          description: "Your new template has been successfully created.",
        });
        form.reset();
        setTemplateData({}); // Clear template data
      }
      
      // Invalidate templates query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      
      if (isEdit) {
        navigate('/admin/templates');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Financial Dashboard Template" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your Excel template.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" placeholder="29.99" {...field} />
                        </FormControl>
                        <FormDescription>
                          The price in USD.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="project_management">Project Management</SelectItem>
                          <SelectItem value="hr_payroll">HR & Payroll</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A brief description of your template" 
                          {...field}
                          rows={3} 
                        />
                      </FormControl>
                      <FormDescription>
                        A short description for the template cards (max 150 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="detailedDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A comprehensive description of your template" 
                          {...field}
                          rows={5} 
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description for the template detail page.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3" 
                          {...field}
                          rows={5} 
                        />
                      </FormControl>
                      <FormDescription>
                        List each feature on a new line.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="mainImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image</FormLabel>
                        <div className="space-y-3">
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          
                          <div className="flex flex-col space-y-2">
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              ref={imageFileInputRef}
                              onChange={handleImageUpload}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={triggerImageFileUpload}
                              className="w-full"
                              disabled={isUploadingImage}
                            >
                              {isUploadingImage ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="mr-2 h-4 w-4" />
                                  Upload Image
                                </>
                              )}
                            </Button>
                            
                            {field.value && (
                              <div className="mt-2">
                                <div className="text-sm font-medium mb-1">Current Image:</div>
                                <div className="relative w-32 h-32 rounded-md border overflow-hidden">
                                  <img 
                                    src={field.value}
                                    alt="Template preview" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image';
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {imageUploadError && (
                              <div className="text-destructive text-sm flex items-center mt-1">
                                <X className="h-4 w-4 mr-1" />
                                {imageUploadError}
                              </div>
                            )}
                          </div>
                        </div>
                        <FormDescription>
                          Upload or provide a URL for the main image of this template.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="filePath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excel Template File</FormLabel>
                        <div className="space-y-3">
                          <FormControl>
                            <Input placeholder="/templates/financial-dashboard.xlsx" {...field} />
                          </FormControl>
                          
                          <div className="flex flex-col space-y-2">
                            <input 
                              type="file" 
                              accept=".xlsx,.xls" 
                              className="hidden"
                              ref={templateFileInputRef}
                              onChange={handleTemplateUpload}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={triggerTemplateFileUpload}
                              className="w-full"
                              disabled={isUploadingTemplate}
                            >
                              {isUploadingTemplate ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                                  Upload Excel Template
                                </>
                              )}
                            </Button>
                            
                            {field.value && (
                              <div className="flex items-center text-sm text-green-600 mt-1">
                                <Check className="h-4 w-4 mr-1" />
                                Template file uploaded
                              </div>
                            )}
                            
                            {templateUploadError && (
                              <div className="text-destructive text-sm flex items-center mt-1">
                                <X className="h-4 w-4 mr-1" />
                                {templateUploadError}
                              </div>
                            )}
                          </div>
                        </div>
                        <FormDescription>
                          Upload your Excel template file (.xlsx or .xls).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="thumbnails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URLs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="https://example.com/thumbnail1.jpg&#10;https://example.com/thumbnail2.jpg" 
                          {...field}
                          rows={3} 
                        />
                      </FormControl>
                      <FormDescription>
                        List each thumbnail URL on a new line.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="compatibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compatibility</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Excel 2016+&#10;Excel for Microsoft 365&#10;Excel for Mac" 
                          {...field}
                          rows={3} 
                        />
                      </FormControl>
                      <FormDescription>
                        List each compatibility note on a new line.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="stripeProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe Product ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="prod_XXXXXXXXXXXXX" 
                            value={field.value || ''} 
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormDescription>
                          The Stripe product ID (optional).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stripePriceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe Price ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="price_XXXXXXXXXXXXX" 
                            value={field.value || ''} 
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormDescription>
                          The Stripe price ID (optional).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Update Template' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="sticky top-6">
          <h3 className="text-lg font-medium mb-4">Template Preview</h3>
          <TemplatePreview template={previewData} />
          <div className="mt-4 text-sm text-muted-foreground">
            This is how your template will appear to customers in the marketplace.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;