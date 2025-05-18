import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Template categories
export const templateCategoryEnum = z.enum([
  "financial",
  "project_management",
  "hr_payroll",
  "marketing",
  "operations"
]);

export type TemplateCategory = z.infer<typeof templateCategoryEnum>;

// Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  detailedDescription: text("detailed_description").notNull(),
  features: text("features").array().notNull(),
  price: doublePrecision("price").notNull(),
  category: text("category").notNull(),
  mainImage: text("main_image").notNull(),
  thumbnails: text("thumbnails").array().notNull(),
  compatibility: text("compatibility").array().notNull(),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  filePath: text("file_path").notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  amount: doublePrecision("amount").notNull(),
  stripePaymentId: text("stripe_payment_id").notNull(),
  downloadLink: text("download_link").notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Users table (for admin access)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull()
});

// Schema for inserting a new template
export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true
});

// Schema for inserting a new order
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  downloadCount: true,
  createdAt: true
});

// Schema for inserting a new user
export const insertUserSchema = createInsertSchema(users).omit({
  id: true
});

// Types for CRUD operations
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
