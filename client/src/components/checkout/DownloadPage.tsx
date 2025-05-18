import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Download, 
  ArrowLeft,
  Loader2 
} from 'lucide-react';

interface DownloadPageProps {
  paymentId: string;
}

interface VerificationResponse {
  success: boolean;
  downloadLink: string;
}

const DownloadPage = ({ paymentId }: DownloadPageProps) => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify the payment and get the download link
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setIsVerifying(true);
        const response = await apiRequest('POST', '/api/verify-payment', { paymentIntentId: paymentId });
        const data: VerificationResponse = await response.json();
        
        if (data.success) {
          setDownloadUrl(data.downloadLink);
        } else {
          setError('Payment verification failed. Please contact support.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred during verification.');
      } finally {
        setIsVerifying(false);
      }
    };

    if (paymentId) {
      verifyPayment();
    }
  }, [paymentId]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
        <p className="text-muted">Please wait while we verify your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 inline-block">
          <div className="font-semibold mb-1">Payment Verification Failed</div>
          <div>{error}</div>
        </div>
        <p className="mb-6">
          If you believe this is an error, please contact our support team for assistance.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/templates">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          </Link>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Purchase!</h1>
        <p className="text-muted">
          Your payment was successful and your template is ready to download.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Download Your Template</h2>
        <p className="mb-6">
          Click the button below to download your Excel template. This link will also be sent to your email for future reference.
        </p>
        
        <a 
          href={downloadUrl || '#'} 
          className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          download
        >
          <Download className="mr-2 h-5 w-5" />
          Download Template
        </a>
        
        <p className="text-sm text-muted mt-4">
          If you have any issues with the download, please <Link href="/contact" className="text-primary hover:underline">contact our support team</Link>.
        </p>
      </div>

      <div className="text-center">
        <Link href="/templates">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse More Templates
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DownloadPage;
