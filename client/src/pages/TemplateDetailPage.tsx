import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Template } from '@shared/schema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TemplateDetail from '@/components/templates/TemplateDetail';
import { Skeleton } from '@/components/ui/skeleton';

interface TemplateDetailPageProps {
  params: {
    id: string;
  };
}

const TemplateDetailPage = ({ params }: TemplateDetailPageProps) => {
  const templateId = parseInt(params.id);
  
  const { data: template, isLoading } = useQuery<Template>({
    queryKey: [`/api/templates/${templateId}`],
  });

  return (
    <>
      <Helmet>
        <title>
          {isLoading 
            ? 'Loading Template...' 
            : `${template?.name || 'Template'} - ExcelTemplates`}
        </title>
        <meta 
          name="description" 
          content={template?.description || 'Professional Excel template for your business needs. Detailed features, preview images, and instant download after purchase.'} 
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {isLoading ? (
            <div className="py-16 container mx-auto px-4 md:px-6">
              <div className="flex items-center text-primary mb-8 hover:underline">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <Skeleton className="h-80 w-full rounded-lg mb-8" />
                  <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-8 w-24 rounded-full mb-4" />
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-32 mb-6" />
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-8" />
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-20 w-full mb-8" />
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-8" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
              </div>
            </div>
          ) : (
            <TemplateDetail id={templateId} />
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TemplateDetailPage;
