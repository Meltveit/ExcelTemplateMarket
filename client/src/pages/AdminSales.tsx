import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import useAuth from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import SalesDashboard from '@/components/admin/SalesDashboard';
import { Loader2 } from 'lucide-react';

const AdminSales = () => {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, don't render anything (we'll redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Sales Dashboard - Admin - ExcelTemplates</title>
      </Helmet>
      
      <AdminLayout title="Sales Dashboard">
        <SalesDashboard />
      </AdminLayout>
    </>
  );
};

export default AdminSales;
