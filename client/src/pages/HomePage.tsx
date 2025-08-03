import { Search, ShoppingBag, Palette, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useLocation } from 'wouter';
import { useState } from 'react';

export function HomePage() {
  const [, setLocation] = useLocation();
  const [searchInput, setSearchInput] = useState('');

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['/api/products', { featured: true }],
    queryFn: () => api.getProducts({ featured: true }),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Get new products (most recent 4)
  const newProducts = [...allProducts]
    .sort((a, b) => b.product_id - a.product_id)
    .slice(0, 4);

  // Get top selling products (highest rated)
  const topSellingProducts = [...allProducts]
    .sort((a, b) => {
      const ratingA = parseFloat(a.product_rating || '0');
      const ratingB = parseFloat(b.product_rating || '0');
      return ratingB - ratingA;
    })
    .slice(0, 4);

  const categories = [
    { name: 'Shoes', icon: ShoppingBag, value: 'Shoes' },
    { name: 'Bags', icon: ShoppingBag, value: 'Handbag' },
    { name: 'Makeup', icon: Palette, value: 'Makeup' },
    { name: 'Clothing', icon: Shirt, value: 'Clothing' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Style</h1>
          <p className="text-xl mb-8 text-gray-300">Discover the latest trends in fashion, beauty, and lifestyle</p>
          
          {/* Hero Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-12">
            <Input
              type="text"
              placeholder="Search for shoes, bags, makeup and more..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-6 pr-16 py-4 rounded-full text-gray-900 text-lg"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Category Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={category.value}
                  className="bg-white/10 rounded-lg p-6 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => setLocation(`/products?type=${category.value}`)}
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-2" />
                  <p>{category.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Suggested Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Suggested For You</h2>
            <p className="text-gray-600">Handpicked items based on your preferences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-gray-600">Fresh styles just added to our collection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Sellers</h2>
            <p className="text-gray-600">Most loved items by our customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSellingProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
