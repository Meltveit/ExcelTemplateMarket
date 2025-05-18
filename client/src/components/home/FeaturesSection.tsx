import { 
  Clock, 
  BarChart3, 
  Download
} from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-primary text-xl" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Excel Templates?</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Our templates are designed by Excel experts and business professionals 
            to save you time and effort.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Clock} 
            title="Save Time" 
            description="Skip hours of spreadsheet setup and formatting with ready-to-use templates."
          />
          
          <FeatureCard 
            icon={BarChart3} 
            title="Professional Design" 
            description="Impress clients and colleagues with professionally designed spreadsheets."
          />
          
          <FeatureCard 
            icon={Download} 
            title="Instant Access" 
            description="Purchase and download immediately. No waiting or complicated licensing."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
