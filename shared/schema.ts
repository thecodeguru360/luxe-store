import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  category_id: integer("category_id").primaryKey().generatedByDefaultAsIdentity(),
  category_name: text("category_name").notNull(),
  parent_category_id: integer("parent_category_id"),
});

export const products = pgTable("products", {
  product_id: integer("product_id").primaryKey().generatedByDefaultAsIdentity(),
  product_name: text("product_name").notNull(),
  product_type: text("product_type", { enum: ['Shoes', 'Handbag', 'Makeup', 'Accessory', 'Clothing'] }).notNull(),
  category_id: integer("category_id"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount_percentage: integer("discount_percentage").default(0),
  product_rating: decimal("product_rating", { precision: 3, scale: 2 }),
  stock_quantity: integer("stock_quantity").notNull().default(0),
  product_description: text("product_description"),
  main_image_url: text("main_image_url"),
  brand: text("brand"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  is_featured: boolean("is_featured").default(false),
  is_active: boolean("is_active").default(true),
});

export const productImages = pgTable("product_images", {
  image_id: integer("image_id").primaryKey().generatedByDefaultAsIdentity(),
  product_id: integer("product_id").notNull(),
  image_url: text("image_url").notNull(),
  is_primary: boolean("is_primary").default(false),
});

export const productAttributes = pgTable("product_attributes", {
  attribute_id: integer("attribute_id").primaryKey().generatedByDefaultAsIdentity(),
  product_id: integer("product_id").notNull(),
  attribute_name: text("attribute_name").notNull(),
  attribute_value: text("attribute_value").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  product_id: true,
  created_at: true,
  updated_at: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  category_id: true,
});

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  image_id: true,
});

export const insertProductAttributeSchema = createInsertSchema(productAttributes).omit({
  attribute_id: true,
});

export type ProductType = 'Shoes' | 'Handbag' | 'Makeup' | 'Accessory' | 'Clothing';

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;

export type InsertProductAttribute = z.infer<typeof insertProductAttributeSchema>;
export type ProductAttribute = typeof productAttributes.$inferSelect;
