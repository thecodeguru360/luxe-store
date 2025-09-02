import { useState } from "react";
import { useParams } from "wouter";
import { Minus, Plus, Star, Truck, Undo, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/cartSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState("8");
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = parseInt(id || "0");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () => api.getProduct(productId),
    enabled: !!productId,
  });

  const product = data?.product;
  const images = data?.images;
  const attributes = data?.attributes;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="aspect-square w-full mb-4" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => setLocation("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const discountedPrice =
    product.discount_percentage && product.discount_percentage > 0
      ? parseFloat(product.price) * (1 - product.discount_percentage / 100)
      : parseFloat(product.price);

  const hasDiscount =
    product.discount_percentage && product.discount_percentage > 0;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product_id: product.product_id,
        quantity,
        selected_size: selectedSize,
        selected_color: selectedColor,
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setLocation("/checkout");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  // Mock images for the gallery
  const productImages: string[] = [
    product.main_image_url,
    product.main_image_url,
    product.main_image_url,
    product.main_image_url,
  ].filter(Boolean);
  /*
  const productImages: string[] = images
    ? images.map((image: any) => image.image_url)
    : [
        product.main_image_url,
        product.main_image_url,
        product.main_image_url,
        product.main_image_url,
      ].filter(Boolean);
*/
  const sizes = ["6", "7", "8", "9", "10", "11"];
  const colors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#6B7280" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={productImages[selectedImage] || "/placeholder-image.jpg"}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <div
                key={index}
                className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  selectedImage === index
                    ? "border-blue-600"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder-image.jpg"}
                  alt={`${product.product_name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.product_name}
            </h1>
            <p className="text-gray-600">{product.brand}</p>
          </div>

          {/* Rating and Reviews */}
          {product.product_rating && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex">
                  {renderStars(parseFloat(product.product_rating))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.product_rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                128 reviews
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <Badge className="bg-green-100 text-green-800">
                  {product.discount_percentage}% off
                </Badge>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.product_description}</p>
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            {/* Size Selection */}
            {product.product_type === "Shoes" && (
              <div>
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`py-2 ${
                        selectedSize === size ? "bg-blue-600 text-white" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-2">Color</h3>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color.name
                        ? "border-blue-600"
                        : "border-gray-300"
                    } shadow-md`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-1 border border-gray-300 rounded-md min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600">
              In Stock ({product.stock_quantity} left)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="w-full border-2 border-blue-600 text-blue-600 py-3 hover:bg-blue-600 hover:text-white"
            >
              Buy Now
            </Button>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Features</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Free shipping on orders over $50
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Undo className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  30-day return policy
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  1-year warranty included
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

        {/* Reviews Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-bold">
                    {product.product_rating}
                  </span>
                  <div>
                    <div className="flex mb-1">
                      {product.product_rating &&
                        renderStars(parseFloat(product.product_rating))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on 128 reviews
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width:
                            rating === 5 ? "80%" : rating === 4 ? "15%" : "5%",
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {rating === 5 ? "102" : rating === 4 ? "19" : "7"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {[
            {
              name: "John Smith",
              rating: 5,
              date: "2 days ago",
              review:
                "Excellent quality! Very comfortable and stylish. The fit is perfect and they look great with both casual and semi-formal outfits.",
              size: "9",
              color: "White",
            },
            {
              name: "Maria Johnson",
              rating: 5,
              date: "1 week ago",
              review:
                "Love these! Great value for money and very comfortable for daily wear. Shipped quickly and arrived in perfect condition.",
              size: "7",
              color: "White",
            },
          ].map((review, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{review.review}</p>
                    <div className="text-sm text-gray-500">
                      <span>Size: {review.size}</span> |{" "}
                      <span>Color: {review.color}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline">View all reviews</Button>
        </div>
      </div>
    </div>
  );
}
