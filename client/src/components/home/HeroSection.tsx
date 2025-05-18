import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero-gradient text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Premium Excel Templates for Business Professionals
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Save hours of work with professionally designed templates. Buy once, 
              download instantly, and use forever.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/templates">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                >
                  Browse Templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <img 
              src="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional Excel dashboard" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
