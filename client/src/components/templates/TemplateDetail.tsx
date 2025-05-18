import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Template } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Star,
  StarHalf,
  CheckCircle,
  Lock
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface TemplateDetailProps {
  id: number;
}

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

const TemplateDetail = ({ id }: TemplateDetailProps) => {
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: template, isLoading } = useQuery<Template>({
    queryKey: [`/api/templates/${id}`],
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!template) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Template not found</h3>
        <p className="text-muted mb-4">The template you're looking for doesn't exist or has been removed.</p>
        <Link href="/templates">
          <Button>Browse Templates</Button>
        </Link>
      </div>
    );
  }
  
  const mainImage = selectedImage || template.mainImage;
  
  const handlePurchase = () => {
    navigate(`/checkout/${template.id}`);
  };
  
  return (
    <section id="template-detail" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <Link href="/templates" className="inline-flex items-center text-primary mb-8 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Templates
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-8">
              <img 
                src={mainImage} 
                alt={template.name} 
                className="rounded-lg w-full"
              />
            </div>
            
            {template.thumbnails && template.thumbnails.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {template.thumbnails.map((thumbnail, index) => (
                  <div 
                    key={index} 
                    className={`bg-white p-2 rounded-lg border cursor-pointer hover:border-primary ${
                      mainImage === thumbnail ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(thumbnail)}
                  >
                    <img 
                      src={thumbnail} 
                      alt={`${template.name} Preview ${index + 1}`} 
                      className="rounded-lg w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <Badge className={`mb-4 ${getCategoryColor(template.category)}`}>
              {getCategoryLabel(template.category)}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {template.name}
            </h1>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center text-yellow-500 mr-2">
                <Star className="fill-current" />
                <Star className="fill-current" />
                <Star className="fill-current" />
                <Star className="fill-current" />
                <StarHalf className="fill-current" />
              </div>
              <span className="text-muted">(24 reviews)</span>
            </div>
            
            <div className="mb-8">
              <p className="text-2xl font-bold mb-2">${template.price.toFixed(2)}</p>
              <p className="text-sm text-muted">One-time purchase, lifetime access</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-muted mb-4">{template.detailedDescription}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-success mt-1 mr-3 h-5 w-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {template.compatibility && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Compatibility</h3>
                <div className="flex flex-wrap gap-3">
                  {template.compatibility.map((item, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-4"
              size="lg"
              onClick={handlePurchase}
            >
              Buy Now - ${template.price.toFixed(2)}
            </Button>
            
            <p className="text-sm text-center text-muted">
              <Lock className="inline-block mr-1 h-4 w-4" />
              Secure checkout with Stripe. Instant download after purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplateDetail;
