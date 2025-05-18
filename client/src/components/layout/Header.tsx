import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            ExcelTemplates
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/templates" 
              className={`font-medium ${isActive('/templates') ? 'text-primary' : 'hover:text-primary transition-colors'}`}
            >
              Templates
            </Link>
            <Link 
              href="/#how-it-works" 
              className="font-medium hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link 
              href="/#faq" 
              className="font-medium hover:text-primary transition-colors"
            >
              FAQs
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium ${isActive('/contact') ? 'text-primary' : 'hover:text-primary transition-colors'}`}
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="hidden md:inline-flex">
              <Button variant="outline" className="text-primary border-primary">
                Admin
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 py-3 space-y-3 bg-white border-t">
            <Link 
              href="/templates" 
              className={`block font-medium ${isActive('/templates') ? 'text-primary' : 'hover:text-primary'}`}
              onClick={closeMobileMenu}
            >
              Templates
            </Link>
            <Link 
              href="/#how-it-works" 
              className="block font-medium hover:text-primary"
              onClick={closeMobileMenu}
            >
              How It Works
            </Link>
            <Link 
              href="/#faq" 
              className="block font-medium hover:text-primary"
              onClick={closeMobileMenu}
            >
              FAQs
            </Link>
            <Link 
              href="/contact" 
              className={`block font-medium ${isActive('/contact') ? 'text-primary' : 'hover:text-primary'}`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            <Link 
              href="/admin" 
              className="block font-medium hover:text-primary"
              onClick={closeMobileMenu}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
