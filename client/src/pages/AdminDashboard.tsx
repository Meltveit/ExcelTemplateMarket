import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Order, Template } from '@shared/schema';
import useAuth from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Download, 
  ShoppingBag, 
  Users, 
  CreditCard,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import {
  Chart,
  ChartContainer,
  ChartSeries,
  ChartItem,
  ChartLabel,
  ChartLegend
} from '@/components/ui/chart';

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/admin/templates'],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  if (authLoading || templatesLoading || ordersLoading) {
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

  // Calculate key metrics
  const totalTemplates = templates?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.amount, 0) || 0;
  const totalDownloads = orders?.reduce((sum, order) => sum + order.downloadCount, 0) || 0;

  // Calculate sales by category
  const salesByCategory = templates?.reduce((acc: Record<string, number>, template) => {
    const templateOrders = orders?.filter(o => o.templateId === template.id) || [];
    const revenue = templateOrders.reduce((sum, order) => sum + order.amount, 0);
    
    if (!acc[template.category]) {
      acc[template.category] = 0;
    }
    
    acc[template.category] += revenue;
    return acc;
  }, {}) || {}; // Provide default empty object to prevent undefined

  // Format for chart
  const chartData = Object.entries(salesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ExcelTemplates</title>
      </Helmet>
      
      <AdminLayout title="Dashboard">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalOrders} orders
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Templates
                </CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTemplates}</div>
                <p className="text-xs text-muted-foreground">
                  Across {new Set(templates?.map(t => t.category)).size || 0} categories
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Downloads
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  {(totalDownloads / (totalOrders || 1)).toFixed(1)} per order
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">
                  +0.5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {chartData.length > 0 ? (
                    <ChartContainer>
                      <ChartLegend />
                      <Chart type="pie">
                        <ChartSeries data={chartData}>
                          {chartData.map((item, index) => (
                            <ChartItem key={index} value={item.value} name={item.name} />
                          ))}
                        </ChartSeries>
                      </Chart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No sales data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {orders && orders.length > 0 ? (
                    orders.slice(0, 5).map((order, index) => {
                      const template = templates?.find(t => t.id === order.templateId);
                      return (
                        <div key={index} className="flex items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {order.customerEmail} purchased {template?.name || 'a template'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()} - ${order.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {templates && templates.length > 0 ? (
                  templates
                    .map(template => {
                      const templateOrders = orders?.filter(o => o.templateId === template.id) || [];
                      const revenue = templateOrders.reduce((sum, order) => sum + order.amount, 0);
                      const downloads = templateOrders.reduce((sum, order) => sum + order.downloadCount, 0);
                      
                      return {
                        ...template,
                        revenue,
                        orderCount: templateOrders.length,
                        downloads
                      };
                    })
                    .sort((a, b) => b.revenue - a.revenue) // Sort by revenue
                    .slice(0, 5) // Top 5
                    .map((template, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-muted-foreground min-w-[24px]">{index + 1}.</span>
                        <div className="space-y-1 ml-2">
                          <p className="text-sm font-medium leading-none">
                            {template.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${template.revenue.toFixed(2)} from {template.orderCount} orders
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No templates available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
