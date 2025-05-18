import { Link } from 'wouter';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">ExcelTemplates</h3>
            <p className="text-gray-400 mb-4">
              Premium Excel templates for business professionals. Save time and boost 
              productivity with our ready-to-use solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/templates" className="text-gray-400 hover:text-white transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Template Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/templates?category=financial" className="text-gray-400 hover:text-white transition-colors">
                  Financial
                </Link>
              </li>
              <li>
                <Link href="/templates?category=project_management" className="text-gray-400 hover:text-white transition-colors">
                  Project Management
                </Link>
              </li>
              <li>
                <Link href="/templates?category=hr_payroll" className="text-gray-400 hover:text-white transition-colors">
                  HR & Payroll
                </Link>
              </li>
              <li>
                <Link href="/templates?category=marketing" className="text-gray-400 hover:text-white transition-colors">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="/templates?category=operations" className="text-gray-400 hover:text-white transition-colors">
                  Operations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  License Agreement
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ExcelTemplates. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <svg className="h-8" viewBox="0 0 111 28" xmlns="http://www.w3.org/2000/svg">
              <path 
                fill="#fff" 
                d="M6.2 15.4c-3.3 0-6-2.7-6-6s2.7-6 6-6c1.8 0 3.3.7 4.5 2l1.7-1.7c-1.5-1.6-3.7-2.7-6.2-2.7-4.6 0-8.3 3.7-8.3 8.3S1.7 17.7 6.2 17.7c2.5 0 4.7-1 6.2-2.7l-1.7-1.7c-1.1 1.3-2.7 2.1-4.5 2.1zM27.2 14.1c0-3.3-2.5-5.4-5.6-5.4-3.1 0-5.6 2.1-5.6 5.4 0 3.3 2.5 5.4 5.6 5.4 3.1 0 5.6-2.1 5.6-5.4zm-2.4 0c0 1.8-1.2 3.3-3.2 3.3s-3.2-1.5-3.2-3.3c0-1.8 1.2-3.3 3.2-3.3s3.2 1.5 3.2 3.3zM36.4 8.7c-2 0-3.6 1.7-3.6 3.8v7h-2.3V9.1h2.3v1.5c.8-1.2 2.1-1.9 3.6-1.9v2.3c0-.1 0-.3 0-.3zM37.7 19.5h2.3V9.1h-2.3v10.4zm1.1-11.9c.8 0 1.4-.7 1.4-1.4 0-.8-.7-1.4-1.4-1.4-.8 0-1.4.7-1.4 1.4 0 .8.6 1.4 1.4 1.4zM47.2 8.7c-3.1 0-5.6 2.1-5.6 5.4 0 3.3 2.5 5.4 5.6 5.4 3.1 0 5.6-2.1 5.6-5.4 0-3.3-2.5-5.4-5.6-5.4zm0 8.7c-1.9 0-3.2-1.5-3.2-3.3 0-1.8 1.2-3.3 3.2-3.3 1.9 0 3.2 1.5 3.2 3.3-.1 1.8-1.3 3.3-3.2 3.3z"
              />
            </svg>
            
            <svg className="h-8" viewBox="0 0 119 40" xmlns="http://www.w3.org/2000/svg">
              <path 
                fill="#fff" 
                d="M9.5 16.5C8.8 16.2 8.4 15.9 8.4 15.4c0-.7.7-1.1 1.7-1.1 2 0 4 .8 5.4 2.2l2.4-4.7c-2.3-1.8-5.2-2.8-8-2.8-4.7 0-8.1 2.7-8.1 6.7 0 3.2 2.1 5.3 5.7 6.4 2.3.7 3.1 1.3 3.1 2.2 0 .9-.8 1.4-2.1 1.4-2.6 0-5.1-1.2-6.8-2.7l-2.4 4.7c2.7 2.1 6.1 3.2 9.3 3.2 5 0 8.5-2.5 8.5-6.8.1-3.5-2-5.6-8.1-7.2zm47.6-9.5c-1.9 0-3.5 1-4.7 2.5v-2.1h-6.1v21h6.4V15.8c0-2.7 1.5-4.1 3.5-4.1 1.4 0 2.5.7 3 2.1l4.9-5c-1.4-1.2-3.4-1.8-7-1.8zm19 0c-6.4 0-10.8 4.5-10.8 11.1 0 6.6 4.4 11.1 10.7 11.1 6.4 0 10.9-4.5 10.9-11.1.1-6.6-4.5-11.1-10.8-11.1zm0 5.8c2.7 0 4.3 2.1 4.3 5.3 0 3.2-1.6 5.3-4.3 5.3-2.6 0-4.3-2.1-4.3-5.3 0-3.2 1.7-5.3 4.3-5.3zM103.6 24c-2.1 0-3.4-1.6-3.4-4 0-2.4 1.3-4 3.4-4s3.4 1.6 3.4 4c0 2.3-1.3 4-3.4 4zm-6.9-17h6.4v21.1h-6.4V7zm9.5-2c0-1.8 1.5-3.3 3.3-3.3 1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3-1.8.1-3.3-1.4-3.3-3.3zm.7 6.6h6.4v16.5H107V11.6zm-20.7 6.4c0-3.8 2.5-6.4 5.9-6.4 2.1 0 3.7.8 4.8 2.4l4.8-4.8c-2.1-2.3-5.1-3.5-9.5-3.5-8.3 0-12.9 5.4-12.9 12.3 0 6.9 4.6 12.2 12.9 12.2 4.3 0 7.4-1.2 9.5-3.5l-4.8-4.8c-1.1 1.6-2.7 2.4-4.8 2.4-3.4 0-5.9-2.5-5.9-6.3z"
              />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
