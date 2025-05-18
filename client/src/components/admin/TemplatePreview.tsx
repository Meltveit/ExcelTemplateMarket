import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Template } from '@shared/schema';

interface TemplatePreviewProps {
  template: Partial<Template>;
}

const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  // Format price with 2 decimal places
  const formattedPrice = template.price 
    ? `$${template.price.toFixed(2)}` 
    : '';

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        {template.mainImage ? (
          <img 
            src={template.mainImage} 
            alt={template.name || 'Template preview'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x400?text=Preview';
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            No preview available
          </div>
        )}
        
        {template.price && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="font-semibold text-lg">
              {formattedPrice}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        {template.name && (
          <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
        )}
        
        {template.description && (
          <p className="text-sm text-slate-600 mb-3">{template.description}</p>
        )}
        
        {template.category && (
          <Badge variant="outline" className="capitalize">
            {template.category.replace('_', ' ')}
          </Badge>
        )}
        
        {template.features && template.features.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Key Features:</h4>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
              {template.features.slice(0, 3).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
              {template.features.length > 3 && (
                <li className="text-slate-400">+{template.features.length - 3} more features</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplatePreview;