import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  price: number;
  templateName: string;
}

const CheckoutForm = ({ price, templateName }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // No return_url needed since we're handling navigation in code
          receipt_email: email,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment Successful',
          description: 'Thank you for your purchase!',
        });
        navigate(`/download/${paymentIntent.id}`);
      }
    } catch (err: any) {
      toast({
        title: 'An error occurred',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>{templateName}</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>${price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your email for receipt and download link"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Information
          </label>
          <PaymentElement />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${price.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;
