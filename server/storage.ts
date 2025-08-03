import { type User, type InsertUser, type Product, type InsertProduct, type Category, type InsertCategory, type ProductImage, type InsertProductImage, type ProductAttribute, type InsertProductAttribute, type ProductType } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProducts(filter?: { type?: ProductType; brand?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product Image operations
  getProductImages(productId: number): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;

  // Product Attribute operations
  getProductAttributes(productId: number): Promise<ProductAttribute[]>;
  createProductAttribute(attribute: InsertProductAttribute): Promise<ProductAttribute>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private productImages: Map<number, ProductImage>;
  private productAttributes: Map<number, ProductAttribute>;
  private productIdCounter: number = 1;
  private categoryIdCounter: number = 1;
  private imageIdCounter: number = 1;
  private attributeIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.productImages = new Map();
    this.productAttributes = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample categories
    const categories = [
      { category_name: "Footwear", parent_category_id: null },
      { category_name: "Bags & Accessories", parent_category_id: null },
      { category_name: "Beauty & Cosmetics", parent_category_id: null },
      { category_name: "Fashion", parent_category_id: null },
    ];
    
    categories.forEach(cat => this.createCategory(cat));

    // Sample products
    const products = [
      {
        product_name: "Premium White Sneakers",
        product_type: "Shoes" as ProductType,
        category_id: 1,
        price: "129.99",
        discount_percentage: 19,
        product_rating: "4.8",
        stock_quantity: 25,
        product_description: "Premium white sneakers with modern design and superior comfort. Crafted with high-quality materials and featuring advanced cushioning technology.",
        main_image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Nike",
        is_featured: true,
        is_active: true
      },
      {
        product_name: "Classic Leather Handbag",
        product_type: "Handbag" as ProductType,
        category_id: 2,
        price: "89.99",
        discount_percentage: 25,
        product_rating: "4.6",
        stock_quantity: 15,
        product_description: "Elegant leather handbag perfect for any occasion. Spacious interior with multiple compartments.",
        main_image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Gucci",
        is_featured: true,
        is_active: true
      },
      {
        product_name: "Luxury Makeup Set",
        product_type: "Makeup" as ProductType,
        category_id: 3,
        price: "79.99",
        discount_percentage: 15,
        product_rating: "4.9",
        stock_quantity: 30,
        product_description: "Complete makeup set with premium quality cosmetics. Includes foundation, eyeshadow palette, lipstick, and brushes.",
        main_image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Chanel",
        is_featured: true,
        is_active: true
      },
      {
        product_name: "Gold Chain Necklace",
        product_type: "Accessory" as ProductType,
        category_id: 2,
        price: "199.99",
        discount_percentage: 10,
        product_rating: "4.7",
        stock_quantity: 12,
        product_description: "Beautiful gold chain necklace with elegant design. Perfect for special occasions.",
        main_image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Tiffany",
        is_featured: false,
        is_active: true
      },
      {
        product_name: "Casual Cotton T-Shirt",
        product_type: "Clothing" as ProductType,
        category_id: 4,
        price: "29.99",
        discount_percentage: 20,
        product_rating: "4.4",
        stock_quantity: 50,
        product_description: "Comfortable cotton t-shirt for everyday wear. Soft fabric with excellent fit.",
        main_image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Nike",
        is_featured: false,
        is_active: true
      },
      {
        product_name: "Running Shoes",
        product_type: "Shoes" as ProductType,
        category_id: 1,
        price: "159.99",
        discount_percentage: 0,
        product_rating: "4.8",
        stock_quantity: 20,
        product_description: "High-performance running shoes for athletes. Advanced cushioning and breathable design.",
        main_image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Adidas",
        is_featured: true,
        is_active: true
      },
      {
        product_name: "Designer Sunglasses",
        product_type: "Accessory" as ProductType,
        category_id: 2,
        price: "249.99",
        discount_percentage: 15,
        product_rating: "4.6",
        stock_quantity: 8,
        product_description: "Stylish designer sunglasses with UV protection. Premium frames with polarized lenses.",
        main_image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Ray-Ban",
        is_featured: false,
        is_active: true
      },
      {
        product_name: "Vintage Denim Jacket",
        product_type: "Clothing" as ProductType,
        category_id: 4,
        price: "89.99",
        discount_percentage: 30,
        product_rating: "4.5",
        stock_quantity: 18,
        product_description: "Classic vintage-style denim jacket. Durable construction with timeless design.",
        main_image_url: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brand: "Levi's",
        is_featured: true,
        is_active: true
      }
    ];

    products.forEach(product => this.createProduct(product));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProducts(filter?: { type?: ProductType; brand?: string; minPrice?: number; maxPrice?: number; featured?: boolean }): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.is_active);
    
    if (filter) {
      if (filter.type) {
        products = products.filter(p => p.product_type === filter.type);
      }
      if (filter.brand) {
        products = products.filter(p => p.brand?.toLowerCase().includes(filter.brand!.toLowerCase()));
      }
      if (filter.minPrice !== undefined) {
        products = products.filter(p => parseFloat(p.price) >= filter.minPrice!);
      }
      if (filter.maxPrice !== undefined) {
        products = products.filter(p => parseFloat(p.price) <= filter.maxPrice!);
      }
      if (filter.featured !== undefined) {
        products = products.filter(p => p.is_featured === filter.featured);
      }
    }
    
    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = {
      ...product,
      product_id: id,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...product,
      updated_at: new Date(),
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = {
      ...category,
      category_id: id,
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product Image operations
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values()).filter(img => img.product_id === productId);
  }

  async createProductImage(image: InsertProductImage): Promise<ProductImage> {
    const id = this.imageIdCounter++;
    const newImage: ProductImage = {
      ...image,
      image_id: id,
    };
    this.productImages.set(id, newImage);
    return newImage;
  }

  // Product Attribute operations
  async getProductAttributes(productId: number): Promise<ProductAttribute[]> {
    return Array.from(this.productAttributes.values()).filter(attr => attr.product_id === productId);
  }

  async createProductAttribute(attribute: InsertProductAttribute): Promise<ProductAttribute> {
    const id = this.attributeIdCounter++;
    const newAttribute: ProductAttribute = {
      ...attribute,
      attribute_id: id,
    };
    this.productAttributes.set(id, newAttribute);
    return newAttribute;
  }
}

export const storage = new MemStorage();
