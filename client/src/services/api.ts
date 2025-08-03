import { apiRequest } from '@/lib/queryClient';
import { type Product, type Category, type ProductType } from '@shared/schema';

export interface ProductFilters {
  type?: ProductType;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
}

export const api = {
  // Product API
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiRequest('GET', url);
    return response.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiRequest('GET', `/api/products/${id}`);
    return response.json();
  },

  // Category API
  getCategories: async (): Promise<Category[]> => {
    const response = await apiRequest('GET', '/api/categories');
    return response.json();
  },

  // Search API
  search: async (query: string): Promise<Product[]> => {
    const response = await apiRequest('GET', `/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Product Images API
  getProductImages: async (productId: number) => {
    const response = await apiRequest('GET', `/api/products/${productId}/images`);
    return response.json();
  },

  // Product Attributes API
  getProductAttributes: async (productId: number) => {
    const response = await apiRequest('GET', `/api/products/${productId}/attributes`);
    return response.json();
  },
};
