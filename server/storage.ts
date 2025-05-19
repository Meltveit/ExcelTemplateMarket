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
    
    // Add the admin user with email credentials
    this.createUser({
      username: "meltveit00@gmail.com",
      password: "Chriss3214", // In a real app, this would be hashed
      isAdmin: true
    });
    
    // No sample templates or orders - you'll add your own products through the admin panel
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
