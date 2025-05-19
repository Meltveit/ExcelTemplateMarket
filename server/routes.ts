import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage as dbStorage } from "./storage";
import Stripe from "stripe";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Please set it for production use.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_SECRET_KEY) : 
  null;

// Configure multer for file uploads
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/uploads/';
    
    if (file.fieldname === 'template') {
      uploadPath += 'templates';
    } else if (file.fieldname === 'image') {
      uploadPath += 'images';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Set up file filter to only allow certain file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'template') {
    // Allow Excel files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  } else if (file.fieldname === 'image') {
    // Allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  } else {
    cb(null, false);
  }
};

const upload = multer({ 
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Authentication middleware for admin routes
const isAdmin = async (req: Request, res: Response, next: () => void) => {
  // Check for the Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    try {
      // Extract and decode the credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
      const [username, password] = credentials.split(':');
      
      // Validate user credentials against the database
      const user = await dbStorage.getUserByUsername(username);
      
      if (user && user.password === password && user.isAdmin) {
        // Store user in request for potential later use
        (req as any).user = user;
        return next();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  }
  
  // If no valid credentials, return 401 Unauthorized
  res.status(401).json({ message: 'Unauthorized' });
};

// Generate a download link with a token
const generateDownloadLink = (orderId: number, templateId: number) => {
  const token = crypto.randomBytes(16).toString('hex');
  return `/api/download/${orderId}/${templateId}/${token}`;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the 'public' directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
  
  // Public API routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await dbStorage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await dbStorage.getTemplateById(id);
      
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
      const templates = await dbStorage.getTemplatesByCategory(category);
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
      
      const template = await dbStorage.getTemplateById(parseInt(templateId));
      
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
      const template = await dbStorage.getTemplateById(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Create an order in your database
      const order = await dbStorage.createOrder({
        templateId,
        customerEmail: paymentIntent.receipt_email || "unknown@example.com",
        customerName: "",
        amount: template.price,
        stripePaymentId: paymentIntent.id,
        downloadLink: generateDownloadLink(0, templateId) // This will be updated after order creation
      });
      
      // Update the download link with the real order ID
      const downloadLink = generateDownloadLink(order.id, templateId);
      await dbStorage.updateOrder(order.id, { downloadLink });
      
      // Increment the template download count
      await dbStorage.incrementTemplateDownloadCount(templateId);
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
      const order = await dbStorage.getOrderByPaymentId(paymentIntentId);
      
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
      
      const order = await dbStorage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const template = await dbStorage.getTemplateById(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Increment the download count
      await dbStorage.incrementOrderDownloadCount(orderId);
      
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
      const templates = await dbStorage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // File upload endpoints for templates
  app.post("/api/admin/upload/template", isAdmin, upload.single('template'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No template file uploaded" });
      }
      
      // Read the file data
      const filePath = `/uploads/templates/${req.file.filename}`;
      const fullPath = path.join(process.cwd(), 'public', filePath);
      
      // Read the file data for database storage
      const fileData = fs.readFileSync(fullPath);
      const base64Data = fileData.toString('base64');
      
      res.json({ 
        success: true, 
        filePath: filePath,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        fileData: base64Data // Sending the base64 data to be stored in the database
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error uploading template: ${error.message}` });
    }
  });
  
  // File upload endpoint for template images
  app.post("/api/admin/upload/image", isAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      
      // Read the file data
      const filePath = `/uploads/images/${req.file.filename}`;
      const fullPath = path.join(process.cwd(), 'public', filePath);
      
      // Read the file data for database storage
      const fileData = fs.readFileSync(fullPath);
      const base64Data = fileData.toString('base64');
      
      res.json({ 
        success: true, 
        filePath: filePath,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        fileData: base64Data // Sending the base64 data to be stored in the database
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error uploading image: ${error.message}` });
    }
  });

  // Create template with form data
  app.post("/api/admin/templates", isAdmin, async (req, res) => {
    try {
      const template = req.body;
      const newTemplate = await dbStorage.createTemplate(template);
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/admin/templates/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const templateUpdate = req.body;
      const updatedTemplate = await dbStorage.updateTemplate(id, templateUpdate);
      
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
      const result = await dbStorage.deleteTemplate(id);
      
      if (!result) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Admin auth check endpoint
  app.get("/api/admin/check-auth", isAdmin, (req, res) => {
    // If middleware passes, user is authenticated
    res.json({ 
      authenticated: true,
      user: (req as any).user
    });
  });

  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    try {
      const orders = await dbStorage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await dbStorage.getOrderById(id);
      
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
