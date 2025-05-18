import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/contact/ContactForm';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Mail,
  Phone,
  Clock,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - ExcelTemplates</title>
        <meta 
          name="description" 
          content="Have questions or need assistance? Contact our support team. We're here to help with any inquiries about our Excel templates." 
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
              <p className="text-muted max-w-2xl mx-auto">
                Have questions or need assistance? We're here to help.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Send us a message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ContactForm />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        Ways to get in touch with our team
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Email</p>
                          <a href="mailto:support@exceltemplates.com" className="text-primary hover:underline">
                            support@exceltemplates.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Phone</p>
                          <a href="tel:+15551234567" className="text-primary hover:underline">
                            +1 (555) 123-4567
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Business Hours</p>
                          <p className="text-muted">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Connect With Us</CardTitle>
                      <CardDescription>
                        Follow us on social media
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4">
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                          aria-label="Instagram"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                        <a 
                          href="#" 
                          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>FAQs</CardTitle>
                      <CardDescription>
                        Quick answers to common questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium">How do I download my template after purchase?</h3>
                        <p className="text-sm text-muted-foreground">
                          After completing your purchase, you'll be automatically redirected to a download page. You'll also receive an email with a download link.
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-medium">Do you offer refunds?</h3>
                        <p className="text-sm text-muted-foreground">
                          Due to the digital nature of our products, we generally do not offer refunds once a template has been downloaded. Please contact us if you encounter any issues.
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-medium">Can I request a custom template?</h3>
                        <p className="text-sm text-muted-foreground">
                          Yes! We offer custom template development services. Please contact us with your requirements for a quote.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Contact;
