import {
  Search,
  ShoppingBag,
  Palette,
  Shirt,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/ProductCard"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { useLocation } from "wouter"
import { useState } from "react"

export function HomePage() {
  const [, setLocation] = useLocation()
  const [searchInput, setSearchInput] = useState("")

  const { data: time = {} } = useQuery({
    queryKey: ["/api/test"],

    queryFn: async () => {
      const response = await api.testApi()
      console.log(response)
      return response
    },
    enabled: true,
  })

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["/api/products/featured"],
    queryFn: () => api.getFeaturedProducts(),
  })

  const { data: allProducts = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: () => api.getProducts(),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion)
    setLocation(`/products?search=${encodeURIComponent(suggestion)}`)
  }

  const searchSuggestions = [
    {
      text: "Show me trending sneakers under $200",
      icon: TrendingUp,
      category: "Popular",
    },
    {
      text: "Find luxury handbags for evening events",
      icon: Sparkles,
      category: "Luxury",
    },
    {
      text: "Comfortable running shoes for daily workouts",
      icon: ShoppingBag,
      category: "Sports",
    },
    {
      text: "Natural makeup products for sensitive skin",
      icon: Palette,
      category: "Beauty",
    },
    {
      text: "Vintage denim jackets in size medium",
      icon: Shirt,
      category: "Fashion",
    },
    {
      text: "Professional accessories for office wear",
      icon: ShoppingBag,
      category: "Work",
    },
  ]

  // Get new products (most recent 4)
  const newProducts = [...allProducts]
    .sort((a, b) => b.product_id - a.product_id)
    .slice(0, 4)

  // Get top selling products (highest rated)
  const topSellingProducts = [...allProducts]
    .sort((a, b) => {
      const ratingA = parseFloat(a.product_rating || "0")
      const ratingB = parseFloat(b.product_rating || "0")
      return ratingB - ratingA
    })
    .slice(0, 4)

  const categories = [
    { name: "Shoes", icon: ShoppingBag, value: "Shoes" },
    { name: "Bags", icon: ShoppingBag, value: "Handbag" },
    { name: "Makeup", icon: Palette, value: "Makeup" },
    { name: "Clothing", icon: Shirt, value: "Clothing" },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 mr-3 text-blue-300 ai-badge-float" />
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-100 border-blue-300/30 ai-badge-float"
            >
              AI-Powered Search
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Style
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Ask our AI to find exactly what you're looking for
          </p>

          {/* AI-Powered Hero Search */}
          <div className="max-w-4xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ask me anything... 'Show me trending sneakers under $200'"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-16 pr-32 py-6 rounded-2xl text-gray-900 text-lg bg-white/95 backdrop-blur-sm border-0 ai-search-glow focus:ring-4 focus:ring-blue-300/50"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                </div>
                <Button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </form>

            {/* Search Suggestions */}
            <div className="text-left">
              <p className="text-sm text-blue-200 mb-4 text-center">
                Try these AI-powered searches:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchSuggestions.map((suggestion, index) => {
                  const IconComponent = suggestion.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 suggestion-shimmer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-white/20 rounded-lg p-2 group-hover:bg-white/30 transition-colors">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white text-xs mb-2 border-0"
                          >
                            {suggestion.category}
                          </Badge>
                          <p className="text-sm text-white group-hover:text-blue-100 transition-colors leading-relaxed">
                            {suggestion.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Category Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80">
            {categories.map(category => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.value}
                  className="bg-white/10 rounded-lg p-6 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() =>
                    setLocation(`/products?type=${category.value}`)
                  }
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-2" />
                  <p>{category.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Suggested Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Suggested For You
            </h2>
            <p className="text-gray-600">
              Handpicked items based on your preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-600">
              Fresh styles just added to our collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Best Sellers
            </h2>
            <p className="text-gray-600">Most loved items by our customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSellingProducts.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
