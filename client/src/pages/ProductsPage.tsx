import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { type ProductType } from '@shared/schema';

export function ProductsPage() {
  const [location] = useLocation();
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const typeFilter = urlParams.get('type') as ProductType | null;
  const brandFilter = urlParams.get('brand');
  const searchQuery = urlParams.get('search');

  const filters = {
    ...(typeFilter && { type: typeFilter }),
    ...(brandFilter && { brand: brandFilter }),
    ...(searchQuery && { search: searchQuery }),
  };

  // Use AI-powered search for natural language queries, fallback to regular search
  const isAiSearch = searchQuery && (
    searchQuery.toLowerCase().includes('show me') ||
    searchQuery.toLowerCase().includes('find') ||
    searchQuery.toLowerCase().includes('looking for') ||
    searchQuery.length > 30 // Longer queries are likely natural language
  );

  const { data: products = [], isLoading } = useQuery({
    queryKey: isAiSearch ? ['/api/ai-search', filters] : ['/api/products', filters],
    queryFn: () => {
      if (isAiSearch && searchQuery) {
        const { search, ...otherFilters } = filters;
        return api.aiSearch(searchQuery, otherFilters);
      }
      return api.getProducts(filters);
    },
  });

  // Sort products based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'newest':
        return b.product_id - a.product_id;
      case 'rating':
        const ratingA = parseFloat(a.product_rating || '0');
        const ratingB = parseFloat(b.product_rating || '0');
        return ratingB - ratingA;
      default:
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (typeFilter) return `${typeFilter} Products`;
    if (brandFilter) return `${brandFilter} Products`;
    return 'All Products';
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, brandFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold">{getPageTitle()}</h2>
              {isAiSearch && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Search
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Sort by: Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} results
          </p>

          {/* Products Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
              <p className="text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-blue-600 text-white' : ''}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
