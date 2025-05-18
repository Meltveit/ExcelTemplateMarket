import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TemplateCard from './TemplateCard';
import { Template } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TemplateGridProps {
  category?: string;
}

const TemplateGrid = ({ category }: TemplateGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No templates found</h3>
        <p className="text-muted">Please check back later for new templates.</p>
      </div>
    );
  }
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);
  
  return (
    <section id="templates" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Browse Our Templates</h2>
            <p className="text-muted">Find the perfect Excel template for your business needs.</p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              <span className="text-muted">Filter:</span>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="project_management">Project Management</SelectItem>
                  <SelectItem value="hr_payroll">HR & Payroll</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
        
        {filteredTemplates.length > 6 && (
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              View All Templates
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplateGrid;
