import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleCart } from "@/store/cartSlice";
import { setSearchQuery } from "@/store/productSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function Navbar() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const {
    data: brands,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/products/brands"],
    queryFn: () => api.getBrands(),
    enabled: true,
  });

  const categories = [
    { name: "Shoes", value: "Shoes" },
    { name: "Handbags", value: "Handbag" },
    { name: "Makeup", value: "Makeup" },
    { name: "Accessories", value: "Accessory" },
    { name: "Clothing", value: "Clothing" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput.trim()));
      setLocation(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    setLocation(`/products?type=${category}`);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">
                Luxe
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                <span>Brands</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {brands?.map((brand) => (
                  <DropdownMenuItem
                    key={brand}
                    onClick={() => setLocation(`/products?brand=${brand}`)}
                  >
                    {brand}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.value}
                    onClick={() => handleCategoryClick(category.value)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900"
            >
              All Products
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => dispatch(toggleCart())}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="space-y-4 mt-8">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-10 pr-4"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </form>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Categories</h3>
                    {categories.map((category) => (
                      <Button
                        key={category.value}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          handleCategoryClick(category.value);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Brands</h3>
                    {brands?.map((brand) => (
                      <Button
                        key={brand}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setLocation(`/products?brand=${brand}`);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {brand}
                      </Button>
                    ))}
                  </div>

                  <Link href="/products">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      All Products
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </form>
        </div>
      </div>
    </nav>
  );
}
