import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to streamline your Excel workflow?
        </h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who save time and boost productivity 
          with our premium Excel templates.
        </p>
        <Link href="/templates">
          <Button 
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            Browse Templates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
