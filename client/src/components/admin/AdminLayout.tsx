import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Layout, 
  LayoutDashboard, 
  FileSpreadsheet, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Menu,
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { toast } = useToast();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold text-primary">
          Admin Panel
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block md:w-64 bg-white md:shadow-sm p-6 md:h-screen md:sticky md:top-0`}
      >
        <div className="hidden md:block">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Admin Panel
          </Link>
        </div>

        <nav className="mt-8 space-y-2">
          <Link href="/admin">
            <Button 
              variant={isActive('/admin') ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/templates">
            <Button 
              variant={isActive('/admin/templates') ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Templates
            </Button>
          </Link>
          <Link href="/admin/sales">
            <Button 
              variant={isActive('/admin/sales') ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Sales
            </Button>
          </Link>
        </nav>

        <Separator className="my-6" />

        <div className="space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              <Layout className="mr-2 h-5 w-5" />
              View Site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
