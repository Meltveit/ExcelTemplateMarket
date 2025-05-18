import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DownloadPageContent from '@/components/checkout/DownloadPage';

interface DownloadPageProps {
  params: {
    paymentId: string;
  };
}

const DownloadPage = ({ params }: DownloadPageProps) => {
  const { paymentId } = params;

  return (
    <>
      <Helmet>
        <title>Download Your Template - ExcelTemplates</title>
        <meta 
          name="description" 
          content="Download your purchased Excel template. Thank you for your purchase!" 
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <DownloadPageContent paymentId={paymentId} />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default DownloadPage;
