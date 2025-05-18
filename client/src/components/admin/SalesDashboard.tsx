import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Order, Template } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { 
  DollarSign, 
  Download, 
  ShoppingCart,
  Loader2
} from 'lucide-react';

// Colors for the pie chart
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const SalesDashboard = () => {
  const [dateRange, setDateRange] = useState('all'); // 'all', 'month', 'week'

  // Fetch orders data
  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  // Fetch templates data
  const { data: templates, isLoading: isLoadingTemplates } = useQuery<Template[]>({
    queryKey: ['/api/admin/templates'],
  });

  if (isLoadingOrders || isLoadingTemplates) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders || !templates) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium mb-2">No data available</h3>
        <p className="text-muted">There was a problem loading the sales data.</p>
      </div>
    );
  }

  // Filter orders based on date range
  const filteredOrders = orders.filter(order => {
    if (dateRange === 'all') return true;
    
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    
    if (dateRange === 'month') {
      // Filter for past month
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }
    
    if (dateRange === 'week') {
      // Filter for past week
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return orderDate >= sevenDaysAgo;
    }
    
    return true;
  });

  // Calculate summary metrics
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Get template name by ID
  const getTemplateName = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };

  // Prepare data for sales by template chart
  const salesByTemplate = templates.map(template => {
    const templateOrders = filteredOrders.filter(order => order.templateId === template.id);
    const salesAmount = templateOrders.reduce((sum, order) => sum + order.amount, 0);
    const salesCount = templateOrders.length;
    
    return {
      id: template.id,
      name: template.name,
      sales: salesAmount,
      orders: salesCount,
    };
  }).sort((a, b) => b.sales - a.sales);

  // Prepare data for daily sales chart
  const getDailySalesData = () => {
    const salesByDay: Record<string, { date: string, sales: number, orders: number }> = {};
    
    // Get range based on dateRange
    const startDate = new Date();
    if (dateRange === 'month') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (dateRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      // For 'all', just show the last 30 days by default
      startDate.setDate(startDate.getDate() - 30);
    }
    
    // Initialize each day with zero sales
    const dateArray = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= new Date()) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      salesByDay[dateString] = { 
        date: format(currentDate, 'MMM dd'), 
        sales: 0, 
        orders: 0 
      };
      currentDate.setDate(currentDate.getDate() + 1);
      dateArray.push(dateString);
    }
    
    // Populate with actual sales data
    filteredOrders.forEach(order => {
      const orderDate = format(new Date(order.createdAt), 'yyyy-MM-dd');
      if (salesByDay[orderDate]) {
        salesByDay[orderDate].sales += order.amount;
        salesByDay[orderDate].orders += 1;
      }
    });
    
    // Convert to array for the chart
    return dateArray.map(date => salesByDay[date]);
  };

  const dailySalesData = getDailySalesData();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredOrders.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              ${averageOrderValue.toFixed(2)} average order
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredOrders.reduce((sum, order) => sum + order.downloadCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(filteredOrders.reduce((sum, order) => sum + order.downloadCount, 0) / (totalOrders || 1) * 100) / 100} per order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Sales amount by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySalesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Template Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Template</CardTitle>
            <CardDescription>Distribution of sales by template</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByTemplate.slice(0, 5)} // Only show top 5
                    nameKey="name"
                    dataKey="sales"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByTemplate.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your most recent sales</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Downloads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.slice(0, 10).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{order.customerEmail}</TableCell>
                  <TableCell>{getTemplateName(order.templateId)}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.downloadCount}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Best Selling Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Best Selling Templates</CardTitle>
          <CardDescription>Your most popular templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesByTemplate
                .filter(template => template.orders > 0)
                .slice(0, 5)
                .map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      {templates.find(t => t.id === template.id)?.category || '-'}
                    </TableCell>
                    <TableCell>
                      ${templates.find(t => t.id === template.id)?.price.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell>{template.orders}</TableCell>
                    <TableCell>${template.sales.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              {salesByTemplate.filter(template => template.orders > 0).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No sales data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
