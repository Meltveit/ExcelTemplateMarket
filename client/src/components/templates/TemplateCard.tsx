import { Link } from 'wouter';
import { Template } from '@shared/schema';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: Template;
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

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={template.mainImage} 
          alt={template.name} 
          className="w-full h-full object-cover"
        />
        <Badge 
          className={`absolute bottom-0 left-0 rounded-tr-lg font-medium ${getCategoryColor(template.category)}`}
        >
          {getCategoryLabel(template.category)}
        </Badge>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
        <p className="text-muted mb-4">{template.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${template.price.toFixed(2)}</span>
          <Link href={`/templates/${template.id}`}>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
