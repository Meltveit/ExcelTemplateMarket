import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button 
        className="flex justify-between items-center w-full text-left font-semibold p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? (
          <Minus className="text-primary h-5 w-5" />
        ) : (
          <Plus className="text-primary h-5 w-5" />
        )}
      </button>
      <div className={`p-4 pt-2 text-muted ${isOpen ? 'block' : 'hidden'}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Everything you need to know about our Excel templates.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <FAQItem 
            question="What format are the templates in?"
            answer="All our templates are provided in .xlsx format, compatible with Microsoft Excel 2016 and newer versions, including Excel for Microsoft 365 and Excel for Mac. Some templates may have limited functionality in Google Sheets."
          />
          
          <FAQItem 
            question="How do I download my template after purchase?"
            answer="After completing your purchase, you'll be automatically redirected to a download page. You'll also receive an email with a download link that remains active for 7 days. If you encounter any issues, please contact our support team."
          />
          
          <FAQItem 
            question="Can I request a custom template?"
            answer="Yes! We offer custom template development services. Please contact us with your requirements, and we'll provide a quote based on the complexity and scope of your project."
          />
          
          <FAQItem 
            question="Do you offer refunds?"
            answer="Due to the digital nature of our products, we generally do not offer refunds once a template has been downloaded. However, if you encounter any issues with your purchase, please contact our support team, and we'll do our best to resolve the situation."
          />
          
          <FAQItem 
            question="Can I use these templates for commercial purposes?"
            answer="Yes, you can use our templates for your business or commercial projects. However, you may not resell, redistribute, or offer the templates themselves (or modified versions) as products. Please refer to our license agreement for full details."
          />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
