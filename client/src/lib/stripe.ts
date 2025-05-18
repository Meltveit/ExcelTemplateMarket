import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";
    if (!key) {
      console.error("Missing Stripe public key. Please set VITE_STRIPE_PUBLIC_KEY in your environment variables.");
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};
