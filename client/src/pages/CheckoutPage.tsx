import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Elements } from '@stripe/react-stripe-js';
import { Template } from '@shared/schema';
import { getStripe } from '@/lib/stripe';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

interface CheckoutPageProps {
  params: {
    id: string;
  };
}

const CheckoutPage = ({ params }: CheckoutPageProps) => {
  const templateId = parseInt(params.id);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: template, isLoading: isLoadingTemplate } = useQuery<Template>({
    queryKey: [`/api/templates/${templateId}`],
  });
  
  // Create payment intent when the page loads
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!templateId) return;
      
      try {
        setIsLoading(true);
        const response = await apiRequest('POST', '/api/create-payment-intent', { templateId });
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('Failed to initialize payment. Please try again.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while setting up the payment.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (templateId) {
      createPaymentIntent();
    }
  }, [templateId]);
  
  if (isLoadingTemplate || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout - {template.name} - ExcelTemplates</title>
        <meta name="description" content="Secure checkout for your Excel template purchase. Complete your order and download immediately." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <Link href={`/templates/${templateId}`} className="inline-flex items-center text-primary mb-6 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Template Details
            </Link>
            
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Details of your purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={template.mainImage}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Template Price</span>
                        <span>${template.price.toFixed(2)}</span>
                      </div>
                      {/* You could add tax, discounts, etc. here */}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${template.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Your payment is secured with Stripe's encrypted payment processing.</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      After payment, you'll get immediate access to download your template.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Form Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Complete your purchase securely</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <div className="text-destructive mb-4">{error}</div>
                      <Button asChild>
                        <Link href={`/templates/${templateId}`}>
                          Return to Template
                        </Link>
                      </Button>
                    </div>
                  ) : clientSecret ? (
                    <Elements 
                      stripe={getStripe()} 
                      options={{ clientSecret, appearance: { theme: 'stripe' } }}
                    >
                      <CheckoutForm 
                        price={template.price} 
                        templateName={template.name} 
                      />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-destructive mb-4">
                        Failed to initialize payment. Please try again.
                      </div>
                      <Button asChild>
                        <Link href={`/templates/${templateId}`}>
                          Return to Template
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default CheckoutPage;
