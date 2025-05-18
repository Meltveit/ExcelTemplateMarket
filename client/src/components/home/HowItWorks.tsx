import { 
  CreditCard, 
  FileSpreadsheet
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Get started with our Excel templates in three simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              1
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm h-full">
              <h3 className="text-xl font-semibold mb-4">Browse & Select</h3>
              <p className="text-muted mb-4">
                Browse our collection of premium Excel templates and choose the one that 
                fits your needs.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" 
                alt="Browsing Excel templates" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              2
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm h-full">
              <h3 className="text-xl font-semibold mb-4">Secure Checkout</h3>
              <p className="text-muted mb-4">
                Complete your purchase securely with our Stripe integration. 
                We never store your payment details.
              </p>
              <div className="flex items-center space-x-3">
                <CreditCard className="text-blue-500 h-6 w-6" />
                <div className="flex space-x-2">
                  <svg viewBox="0 0 32 21" className="h-6 w-9 text-blue-800">
                    <path d="M32 0H0v21h32V0z" fill="#016FD0" />
                    <path d="M16 6.9c0 2.3 1.4 3.6 3.9 3.6 1.4 0 2.3-.2 3.1-.7v-3.4c-.5.3-1.8.8-2.7.8-1.4 0-1.9-.8-1.9-1.5 0-.7.5-1.5 1.9-1.5.9 0 2.2.5 2.7.8v-3.4c-.7-.5-1.7-.7-3.1-.7-2.5 0-3.9 1.3-3.9 3.6zM0 13.9h4.3v-8H0v8zm28.8 0L25.5 7l3.3-1.1v8h-4.3v-8h-4.9l.8 3.5c-.5.1-1.1.3-1.4.5-.5.2-.9.5-1.2.8-.3.3-.5.7-.5 1.2 0 .5.1.9.4 1.3.3.4.7.6 1.3.8.5.2 1.1.3 1.8.3.9 0 1.8-.1 2.7-.4h4.3zm-20.5 0H5.6v-5.9L2.3 13.9 0 13.9l3.3-15.8 3.3 15.8h1.7z" fill="#FFF" />
                  </svg>
                  <svg viewBox="0 0 38 24" className="h-6 w-9 text-blue-800">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07" />
                    <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF" />
                    <path d="M13.3 15.1c-.4 0-.8.2-1.1.5-.3.3-.4.7-.4 1.1 0 .4.1.8.4 1.1.3.3.7.5 1.1.5.4 0 .8-.2 1.1-.5.3-.3.4-.7.4-1.1 0-.4-.1-.8-.4-1.1-.3-.3-.6-.5-1.1-.5zm-5.7-7h3.8L8.1 13.5l-3.4-5.4h3.8l1.3 2.2 1.3-2.2zm7.1 0h-2.2l4 6.7v3.3h2.2v-3.2L23 8.1h-2.2l-2.7 4.4-2.7-4.4zm8.7 0h3.2c.5 0 1 .1 1.4.3.4.2.7.5 1 .9.2.4.3.9.3 1.5 0 .6-.1 1.1-.3 1.5-.2.4-.5.7-.9.9-.4.2-.9.3-1.5.3h-1.1v3.5h-2.1V8.1zm4.3 2.7c0-.3-.1-.5-.2-.7-.1-.2-.3-.3-.5-.3h-1.4v2.1h1.4c.2 0 .4-.1.5-.3.1-.2.2-.4.2-.7v-.1zM26 8.1h6.7v1.8h-4.6v1.8h3.9v1.8h-3.9v1.8h4.6v1.8H26V8.1zm10.4 5.2c.4.3.6.7.6 1.3 0 .4-.1.7-.3 1-.2.3-.5.6-.8.7-.4.2-.8.2-1.3.2h-3.1V8.1h3c.5 0 .9.1 1.3.2.3.1.6.3.8.6.2.3.3.6.3.9 0 .5-.2.9-.5 1.2-.3.3-.8.5-1.3.6.7.1 1.1.3 1.3.7zm-3.6-3.1v1.6h1c.3 0 .5-.1.7-.2.2-.1.2-.3.2-.6 0-.2-.1-.4-.2-.5-.2-.1-.4-.2-.7-.2h-1zm1.1 3.9c.3 0 .5-.1.7-.2.2-.1.3-.3.3-.6 0-.5-.3-.8-1-.8h-1.1v1.6h1.1z" fill="#2566AF" />
                    <path d="M16.3 15.1c-.3 0-.6.1-.9.2l-.2.2-.6 1c0-.3-.1-.6-.3-.8-.2-.2-.4-.3-.7-.4-.3-.1-.6-.1-.9-.1-.3 0-.6.1-.9.2-.3.1-.5.3-.7.5-.2.2-.3.5-.4.8-.1.3-.1.6-.1.9 0 .3.1.6.2.9.1.3.2.5.4.7.2.2.4.3.7.5.3.1.6.2.9.2.3 0 .7-.1 1-.2.3-.1.5-.3.6-.5h.1v.6h1.1v-3.2c0-.4-.1-.7-.3-1s-.4-.5-.7-.6c-.3-.2-.6-.2-1-.2zm9.1-7c.4 0 .7.1 1 .3.3.2.5.4.7.8.2.4.2.8.2 1.4 0 .5-.1 1-.2 1.3-.2.3-.4.6-.7.8-.3.2-.6.2-1 .2h-1.1v-4.9h1.1z" fill="#182E66" />
                  </svg>
                  <svg viewBox="0 0 38 24" className="h-6 w-9 text-red-500">
                    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07" />
                    <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF" />
                    <path d="M21.4 11.6c0-2.8-2.2-5-5-5-2.8 0-5 2.2-5 5 0 2.8 2.2 5 5 5 2.7 0 5-2.2 5-5zm-8.6 0c0-2 1.6-3.6 3.6-3.6 2 0 3.6 1.6 3.6 3.6 0 2-1.6 3.6-3.6 3.6-2 0-3.6-1.6-3.6-3.6zm18.3 3.7c.4-.5.7-1.2.7-2 0-1.5-1.2-2.7-2.8-2.8h-2.2c.3-.7 1-1.2 1.8-1.2.3 0 .5 0 .8.1l.1-1.3c-.3-.1-.6-.1-1-.1-1.6 0-2.9 1-3.3 2.5h-.7v1.3h.6c0 .2-.1.5-.1.8 0 .3 0 .5.1.8h-.6v1.3h.7c.5 1.4 1.7 2.4 3.3 2.4.4 0 .8-.1 1.1-.2l-.2-1.2c-.2.1-.5.2-.8.2-.8 0-1.5-.5-1.8-1.2h2.3v-.1c.9-.1 1.5-.6 1.8-1.2zm-4.3-1.9c0-.3 0-.5.1-.8h1.9c.8 0 1.4.5 1.4 1.4 0 .4-.1.8-.4 1h-3c0-.5 0-.9 0-1.6zm-6.9.1v3.6h1.4v-7.2h-1.4v3.6zm-7.7-5.9v9.4h1.4v-9.4h-1.4zm20.3 8.9c-.1 0-.2 0-.3-.1-.2-.3-.3-.6-.3-.9 0-.4.1-.7.4-1 .3-.3.6-.4 1.1-.4.4 0 .7.1 1 .3l.8-.8c-.5-.4-1.1-.6-1.8-.6-1.6 0-2.9 1.1-2.9 2.5 0 .7.3 1.3.9 1.8-.6.3-.9.7-.9 1.3 0 .3.1.6.3.8h.1c-.8.2-1.3.8-1.3 1.5 0 1 .8 1.6 2.1 1.6 1.5 0 2.6-.8 2.6-2.1 0-1.1-.8-1.8-2.5-1.8-.7 0-1.1-.1-1.3-.3-.1-.1-.1-.2-.1-.4 0-.3.1-.5.4-.6zm.2 3.5c1 0 1.4.3 1.4.9 0 .6-.5 1-1.4 1-.8 0-1.2-.3-1.2-.9 0-.5.5-.9 1.2-1zm.8-7.1l-.8.8c.5.4.8.9.8 1.6 0 1.1-.9 1.9-2.1 1.9-1.2 0-2-.8-2-1.9 0-.7.3-1.2.8-1.6l-.8-.8c-.7.5-1.1 1.4-1.1 2.3 0 1.7 1.3 2.9 3.1 2.9s3.1-1.2 3.1-2.9c0-1-.4-1.8-1-2.3z" fill="#EB001B" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              3
            </div>
            <div className="p-6 rounded-lg bg-white shadow-sm h-full">
              <h3 className="text-xl font-semibold mb-4">Download & Use</h3>
              <p className="text-muted mb-4">
                Get instant access to your downloaded template and start using it right away.
              </p>
              <div className="flex items-center">
                <FileSpreadsheet className="text-green-600 h-6 w-6 mr-3" />
                <span>Ready to use in Microsoft Excel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
