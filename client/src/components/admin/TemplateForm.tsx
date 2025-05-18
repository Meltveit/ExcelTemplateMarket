import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertTemplateSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

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
import { Loader2 } from 'lucide-react';

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
});

const TemplateForm = ({ templateId, defaultValues, isEdit = false }: TemplateFormProps) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (isEdit && templateId) {
        await apiRequest('PUT', `/api/admin/templates/${templateId}`, values);
        toast({
          title: "Template updated",
          description: "The template has been successfully updated.",
        });
      } else {
        await apiRequest('POST', '/api/admin/templates', values);
        toast({
          title: "Template created",
          description: "Your new template has been successfully created.",
        });
        form.reset();
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
                    <FormLabel>Main Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to the main image for this template.
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
                    <FormLabel>Excel File Path</FormLabel>
                    <FormControl>
                      <Input placeholder="/templates/financial-dashboard.xlsx" {...field} />
                    </FormControl>
                    <FormDescription>
                      Path to the Excel template file.
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
                      <Input placeholder="prod_XXXXXXXXXXXXX" {...field} />
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
                      <Input placeholder="price_XXXXXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      The Stripe price ID (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/templates')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Update Template' : 'Create Template'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TemplateForm;
