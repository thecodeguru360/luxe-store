import axios from 'axios';
import { type Product, type Category, type ProductType } from '@/types/schema';

export interface ProductFilters {
  type?: ProductType;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
}

// Configure axios instance for your Python API
// You can update the baseURL to point to your Python API endpoint
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Update this to your Python API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
    
    const response = await apiClient.get(`/api/products${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  // Category API
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  // Search API - AI-powered search
  search: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get(`/api/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // AI-powered search with enhanced parameters
  aiSearch: async (query: string, filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`/api/ai-search?${params.toString()}`);
    return response.data;
  },

  // Product Images API
  getProductImages: async (productId: number) => {
    const response = await apiClient.get(`/api/products/${productId}/images`);
    return response.data;
  },

  // Product Attributes API
  getProductAttributes: async (productId: number) => {
    const response = await apiClient.get(`/api/products/${productId}/attributes`);
    return response.data;
  },
};
