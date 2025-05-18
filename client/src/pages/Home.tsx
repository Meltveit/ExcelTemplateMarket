import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorks from '@/components/home/HowItWorks';
import TemplateGrid from '@/components/templates/TemplateGrid';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>ExcelTemplates - Premium Excel Templates for Professionals</title>
        <meta 
          name="description" 
          content="Save hours of work with professionally designed Excel templates. Buy once, download instantly, and use forever. Premium templates for finance, project management, HR, and more." 
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <HowItWorks />
          <TemplateGrid />
          <Testimonials />
          <FAQ />
          <CTASection />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Home;
