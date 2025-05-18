import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import path from "path";
import fs from "fs";
import crypto from "crypto";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Please set it for production use.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" }) : 
  null;

// Simple authentication middleware for admin routes
const isAdmin = (req: Request, res: Response, next: () => void) => {
  // In a real app, this would check for a valid session and admin rights
  // For now, we'll just check if the authorization header contains "admin:admin123"
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [username, password] = credentials.split(':');
    
    if (username === 'admin' && password === 'admin123') {
      return next();
    }
  }
  
  res.status(401).json({ message: 'Unauthorized' });
};

// Generate a download link with a token
const generateDownloadLink = (orderId: number, templateId: number) => {
  const token = crypto.randomBytes(16).toString('hex');
  return `/api/download/${orderId}/${templateId}/${token}`;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Public API routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.get("/api/templates/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const templates = await storage.getTemplatesByCategory(category);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates by category" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }
      
      const { templateId } = req.body;
      
      if (!templateId) {
        return res.status(400).json({ message: "Template ID is required" });
      }
      
      const template = await storage.getTemplateById(parseInt(templateId));
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(template.price * 100), // Convert to cents
        currency: "usd",
        metadata: {
          templateId: template.id.toString(),
          templateName: template.name
        }
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        template
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error creating payment intent: ${error.message}` });
    }
  });

  // Webhook for handling successful payments
  app.post("/api/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }
    
    let event;
    
    try {
      // Get the signature from the headers
      const signature = req.headers['stripe-signature'] as string;
      
      // Verify the event
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Extract the template ID from the metadata
      const templateId = parseInt(paymentIntent.metadata.templateId);
      const template = await storage.getTemplateById(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Create an order in your database
      const order = await storage.createOrder({
        templateId,
        customerEmail: paymentIntent.receipt_email || "unknown@example.com",
        customerName: "",
        amount: template.price,
        stripePaymentId: paymentIntent.id,
        downloadLink: generateDownloadLink(0, templateId) // This will be updated after order creation
      });
      
      // Update the download link with the real order ID
      const downloadLink = generateDownloadLink(order.id, templateId);
      await storage.updateOrder(order.id, { downloadLink });
      
      // Increment the template download count
      await storage.incrementTemplateDownloadCount(templateId);
    }
    
    res.json({ received: true });
  });

  // Endpoint to verify a payment and get the download link
  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment Intent ID is required" });
      }
      
      // Check if there's an order with this payment ID
      const order = await storage.getOrderByPaymentId(paymentIntentId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Return the download link
      res.json({
        success: true,
        downloadLink: order.downloadLink
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error verifying payment: ${error.message}` });
    }
  });

  // File download endpoint
  app.get("/api/download/:orderId/:templateId/:token", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const templateId = parseInt(req.params.templateId);
      
      // In a real app, you would validate the token here
      
      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const template = await storage.getTemplateById(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Increment the download count
      await storage.incrementOrderDownloadCount(orderId);
      
      // In a real app, you would serve the actual file here
      // For now, we'll just return a success message
      const filePath = path.join(process.cwd(), 'public', template.filePath);
      
      // Check if file exists
      if (fs.existsSync(filePath)) {
        res.download(filePath, `${template.name}.xlsx`);
      } else {
        // For development, since we don't have real files
        res.json({
          success: true,
          message: "This is where you would download your Excel template.",
          templateName: template.name
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: `Error downloading file: ${error.message}` });
    }
  });

  // Admin API routes
  app.get("/api/admin/templates", isAdmin, async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/admin/templates", isAdmin, async (req, res) => {
    try {
      const template = req.body;
      const newTemplate = await storage.createTemplate(template);
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/admin/templates/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const templateUpdate = req.body;
      const updatedTemplate = await storage.updateTemplate(id, templateUpdate);
      
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(updatedTemplate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/admin/templates/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteTemplate(id);
      
      if (!result) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
