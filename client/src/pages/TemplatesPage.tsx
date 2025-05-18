import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TemplateGrid from '@/components/templates/TemplateGrid';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const TemplatesPage = () => {
  const [location] = useLocation();
  const [category, setCategory] = useState<string>('all');
  
  // Extract category from URL query parameter if present
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [location]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    
    // Update URL with the selected category
    const url = value === 'all'
      ? '/templates'
      : `/templates?category=${value}`;
    
    // Using history API to update URL without navigating
    window.history.pushState({}, '', url);
  };

  return (
    <>
      <Helmet>
        <title>Browse Excel Templates - ExcelTemplates</title>
        <meta 
          name="description" 
          content="Browse our collection of professional Excel templates for business, finance, project management, HR, and more. Download instantly after purchase." 
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <div className="bg-gray-50 py-8">
            <div className="container mx-auto px-4 md:px-6">
              <h1 className="text-3xl font-bold mb-4">Excel Templates</h1>
              <p className="text-muted max-w-2xl mb-6">
                Browse our collection of premium Excel templates designed to save you time and 
                boost your productivity.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-muted">Filter by category:</span>
                  <Select value={category} onValueChange={handleCategoryChange}>
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
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Newest First</Button>
                  <Button variant="outline" size="sm">Price: Low to High</Button>
                </div>
              </div>
            </div>
          </div>
          
          <TemplateGrid category={category !== 'all' ? category : undefined} />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TemplatesPage;
