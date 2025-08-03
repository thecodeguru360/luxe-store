import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, type ProductType } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { type, brand, minPrice, maxPrice, featured, search } = req.query;
      
      const filter: any = {};
      if (type) filter.type = type as ProductType;
      if (brand) filter.brand = brand as string;
      if (minPrice) filter.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filter.maxPrice = parseFloat(maxPrice as string);
      if (featured !== undefined) filter.featured = featured === 'true';
      
      let products = await storage.getProducts(filter);
      
      // Apply search filter if provided
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        products = products.filter(p => 
          p.product_name.toLowerCase().includes(searchTerm) ||
          p.brand?.toLowerCase().includes(searchTerm) ||
          p.product_description?.toLowerCase().includes(searchTerm)
        );
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedProduct = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedProduct);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Product Images routes
  app.get("/api/products/:id/images", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const images = await storage.getProductImages(productId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product images" });
    }
  });

  // Product Attributes routes
  app.get("/api/products/:id/attributes", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const attributes = await storage.getProductAttributes(productId);
      res.json(attributes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product attributes" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const searchTerm = (q as string).toLowerCase();
      const products = await storage.getProducts();
      
      const filteredProducts = products.filter(p => 
        p.product_name.toLowerCase().includes(searchTerm) ||
        p.brand?.toLowerCase().includes(searchTerm) ||
        p.product_description?.toLowerCase().includes(searchTerm) ||
        p.product_type.toLowerCase().includes(searchTerm)
      );
      
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
