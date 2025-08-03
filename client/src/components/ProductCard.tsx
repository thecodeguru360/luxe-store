import { Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Product } from '@shared/schema';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { useLocation } from 'wouter';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const dispatch = useAppDispatch();
  
  const discountedPrice = product.discount_percentage && product.discount_percentage > 0
    ? (parseFloat(product.price) * (1 - product.discount_percentage / 100)).toFixed(2)
    : parseFloat(product.price).toFixed(2);
  
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({
      product_id: product.product_id,
      quantity: 1,
    }));
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setLocation(`/product/${product.product_id}`);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm"
      onClick={handleCardClick}
    >
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
        <img 
          src={product.main_image_url || '/placeholder-image.jpg'} 
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {product.discount_percentage}% OFF
          </Badge>
        )}
        {product.stock_quantity < 10 && (
          <Badge className="absolute top-2 right-2 bg-orange-500 text-white">
            Low Stock
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
          {product.product_name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        {product.product_rating && (
          <div className="flex items-center mb-2 space-x-1">
            <div className="flex">
              {renderStars(parseFloat(product.product_rating))}
            </div>
            <span className="text-sm text-gray-600">({product.product_rating})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900">${discountedPrice}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">${parseFloat(product.price).toFixed(2)}</span>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 h-8 w-8"
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
