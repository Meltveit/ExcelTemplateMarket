import { 
  Template, InsertTemplate, 
  Order, InsertOrder, 
  User, InsertUser, 
  templates, orders, users
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  incrementTemplateDownloadCount(id: number): Promise<void>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderByPaymentId(paymentId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, orderUpdate: Partial<InsertOrder>): Promise<Order | undefined>;
  incrementOrderDownloadCount(id: number): Promise<void>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private templates: Map<number, Template>;
  private orders: Map<number, Order>;
  private users: Map<number, User>;
  private templateCurrentId: number;
  private orderCurrentId: number;
  private userCurrentId: number;

  constructor() {
    this.templates = new Map();
    this.orders = new Map();
    this.users = new Map();
    this.templateCurrentId = 1;
    this.orderCurrentId = 1;
    this.userCurrentId = 1;
    
    // Add admin users
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      isAdmin: true
    });
    
    // Add the specific admin user with email credentials
    this.createUser({
      username: "meltveit00@gmail.com",
      password: "Chriss3214", // In a real app, this would be hashed
      isAdmin: true
    });
    
    // Add some sample templates
    this.createTemplate({
      name: "Financial Dashboard Template",
      description: "Comprehensive financial dashboard with advanced analytics, reporting, and visualization tools.",
      detailedDescription: "A comprehensive financial dashboard template designed for business professionals. This template includes advanced analytics, reporting tools, and visualization components to help you make better financial decisions. Track key financial metrics, analyze trends, and generate reports with ease. Perfect for financial analysts, business owners, and accounting professionals.",
      features: [
        "Income and expense tracking with automated calculations",
        "Balance sheet and cash flow statement generators",
        "Interactive financial charts and visualizations",
        "Financial ratio analysis tools",
        "Budget vs. actual comparison reports"
      ],
      price: 29.99,
      category: "financial",
      mainImage: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
      ],
      compatibility: [
        "Excel 2016+",
        "Excel for Microsoft 365",
        "Excel for Mac",
        "Google Sheets (Limited)"
      ],
      stripeProductId: "prod_financial",
      stripePriceId: "price_financial",
      filePath: "/templates/financial-dashboard.xlsx"
    });
    
    this.createTemplate({
      name: "Project Management Suite",
      description: "Complete project management solution with Gantt charts, resource allocation, and budget tracking.",
      detailedDescription: "A comprehensive project management template designed for project managers and team leaders. Track tasks, deadlines, resources, and budgets all in one place. Visualize project timelines with Gantt charts and easily monitor progress with automated dashboards.",
      features: [
        "Interactive Gantt chart for project scheduling",
        "Resource allocation and management tools",
        "Budget tracking and cost analysis",
        "Task assignment and progress tracking",
        "Automated status reports and dashboards"
      ],
      price: 34.99,
      category: "project_management",
      mainImage: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
      ],
      compatibility: [
        "Excel 2016+",
        "Excel for Microsoft 365",
        "Excel for Mac",
        "Google Sheets (Limited)"
      ],
      stripeProductId: "prod_project",
      stripePriceId: "price_project",
      filePath: "/templates/project-management.xlsx"
    });
    
    this.createTemplate({
      name: "HR & Payroll System",
      description: "Streamline your HR processes with our comprehensive HR and payroll management system.",
      detailedDescription: "A complete HR and payroll management solution for businesses of all sizes. Manage employee data, track attendance, calculate payroll, and generate tax reports all from a single Excel workbook. Designed by HR professionals to simplify your HR workflow.",
      features: [
        "Employee database with comprehensive record keeping",
        "Automated payroll calculation and tax deductions",
        "Leave management and attendance tracking",
        "Performance evaluation and review tools",
        "Tax and compliance reporting"
      ],
      price: 39.99,
      category: "hr_payroll",
      mainImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
      ],
      compatibility: [
        "Excel 2016+",
        "Excel for Microsoft 365",
        "Excel for Mac"
      ],
      stripeProductId: "prod_hr",
      stripePriceId: "price_hr",
      filePath: "/templates/hr-payroll.xlsx"
    });
    
    this.createTemplate({
      name: "Marketing Analytics Dashboard",
      description: "Track campaign performance, ROI, and customer engagement with this comprehensive dashboard.",
      detailedDescription: "A powerful marketing analytics dashboard for measuring the effectiveness of your marketing campaigns. Track key metrics like conversion rates, cost per acquisition, and ROI across multiple channels. Visualize trends and gain insights to optimize your marketing strategy.",
      features: [
        "Multi-channel campaign tracking and comparison",
        "ROI and conversion rate calculations",
        "Customer engagement and retention metrics",
        "Budget allocation and performance analysis",
        "Automated data visualization and reporting"
      ],
      price: 24.99,
      category: "marketing",
      mainImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
      ],
      compatibility: [
        "Excel 2016+",
        "Excel for Microsoft 365",
        "Excel for Mac",
        "Google Sheets"
      ],
      stripeProductId: "prod_marketing",
      stripePriceId: "price_marketing",
      filePath: "/templates/marketing-analytics.xlsx"
    });
    
    this.createTemplate({
      name: "Budget Planning & Forecasting",
      description: "Plan your business budget with accurate forecasting tools and scenario analysis.",
      detailedDescription: "A comprehensive budget planning and forecasting template for businesses and individuals. Create detailed budgets, forecast future financial performance, and analyze different scenarios to make informed financial decisions. Includes pre-built formulas and automation to save you time.",
      features: [
        "Annual and monthly budget planning worksheets",
        "Financial forecasting with trend analysis",
        "Scenario planning and what-if analysis",
        "Variance analysis and budget vs. actual tracking",
        "Customizable categories and sub-categories"
      ],
      price: 19.99,
      category: "financial",
      mainImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
      ],
      compatibility: [
        "Excel 2016+",
        "Excel for Microsoft 365",
        "Excel for Mac",
        "Google Sheets"
      ],
      stripeProductId: "prod_budget",
      stripePriceId: "price_budget",
      filePath: "/templates/budget-planning.xlsx"
    });
    
    this.createTemplate({
      name: "Inventory Management System",
      description: "Track inventory, manage suppliers, and optimize stock levels with this powerful template.",
      detailedDescription: "A complete inventory management system for tracking stock levels, managing suppliers, and optimizing inventory. Monitor product movement, get low stock alerts, and generate purchase orders automatically. Reduce costs and prevent stockouts with this easy-to-use template.",
      features: [
        "Product catalog and inventory tracking",
        "Supplier management and purchase order generation",
        "Low stock alerts and reorder point calculations",
        "Inventory valuation and cost analysis",
        "Sales and inventory reports with visualizations"
      ],
      price: 27.99,
      category: "operations",
      mainImage: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
      ],
      compatibility: [
        "Excel 2016+",
        "Excel for Microsoft 365",
        "Excel for Mac"
      ],
      stripeProductId: "prod_inventory",
      stripePriceId: "price_inventory",
      filePath: "/templates/inventory-management.xlsx"
    });
    
    // Create some sample orders for testing
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Add sample orders with different dates
    this.createOrderWithDate({
      templateId: 1,
      customerEmail: "johndoe@example.com",
      customerName: "John Doe",
      amount: 29.99,
      stripePaymentId: "pi_sample1",
      downloadLink: "/api/download/1/1/sample-token",
      downloadCount: 2
    }, threeMonthsAgo);
    
    this.createOrderWithDate({
      templateId: 2,
      customerEmail: "janesmith@example.com",
      customerName: "Jane Smith",
      amount: 34.99,
      stripePaymentId: "pi_sample2",
      downloadLink: "/api/download/2/2/sample-token",
      downloadCount: 1
    }, twoMonthsAgo);
    
    this.createOrderWithDate({
      templateId: 3,
      customerEmail: "robert@example.com",
      customerName: "Robert Johnson",
      amount: 39.99,
      stripePaymentId: "pi_sample3",
      downloadLink: "/api/download/3/3/sample-token",
      downloadCount: 3
    }, oneMonthAgo);
    
    this.createOrderWithDate({
      templateId: 4,
      customerEmail: "sarah@example.com",
      customerName: "Sarah Williams",
      amount: 24.99,
      stripePaymentId: "pi_sample4",
      downloadLink: "/api/download/4/4/sample-token",
      downloadCount: 1
    }, twoWeeksAgo);
    
    this.createOrderWithDate({
      templateId: 5,
      customerEmail: "michael@example.com",
      customerName: "Michael Brown",
      amount: 19.99,
      stripePaymentId: "pi_sample5",
      downloadLink: "/api/download/5/5/sample-token",
      downloadCount: 2
    }, oneWeekAgo);
    
    this.createOrderWithDate({
      templateId: 6,
      customerEmail: "emily@example.com",
      customerName: "Emily Davis",
      amount: 27.99,
      stripePaymentId: "pi_sample6",
      downloadLink: "/api/download/6/6/sample-token",
      downloadCount: 1
    }, yesterday);
    
    // Add some more orders for popular templates
    this.createOrderWithDate({
      templateId: 1,
      customerEmail: "david@example.com",
      customerName: "David Wilson",
      amount: 29.99,
      stripePaymentId: "pi_sample7",
      downloadLink: "/api/download/7/1/sample-token",
      downloadCount: 1
    }, twoWeeksAgo);
    
    this.createOrderWithDate({
      templateId: 1,
      customerEmail: "jessica@example.com",
      customerName: "Jessica Taylor",
      amount: 29.99,
      stripePaymentId: "pi_sample8",
      downloadLink: "/api/download/8/1/sample-token",
      downloadCount: 2
    }, oneWeekAgo);
    
    this.createOrderWithDate({
      templateId: 3,
      customerEmail: "kevin@example.com",
      customerName: "Kevin Martinez",
      amount: 39.99,
      stripePaymentId: "pi_sample9",
      downloadLink: "/api/download/9/3/sample-token",
      downloadCount: 1
    }, yesterday);
  }

  private createOrderWithDate(order: InsertOrder, date: Date): Order {
    const id = this.orderCurrentId++;
    const newOrder: Order = {
      ...order,
      id,
      downloadCount: order.downloadCount || 0,
      createdAt: date
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.category === category
    );
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.templateCurrentId++;
    const now = new Date();
    const newTemplate: Template = {
      ...template,
      id,
      downloadCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: number, templateUpdate: Partial<InsertTemplate>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updatedTemplate: Template = {
      ...template,
      ...templateUpdate,
      updatedAt: new Date()
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  async incrementTemplateDownloadCount(id: number): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.downloadCount += 1;
      this.templates.set(id, template);
    }
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByPaymentId(paymentId: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.stripePaymentId === paymentId
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const now = new Date();
    const newOrder: Order = {
      ...order,
      id,
      downloadCount: 0,
      createdAt: now
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrder(id: number, orderUpdate: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder: Order = {
      ...order,
      ...orderUpdate
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async incrementOrderDownloadCount(id: number): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.downloadCount += 1;
      this.orders.set(id, order);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();
