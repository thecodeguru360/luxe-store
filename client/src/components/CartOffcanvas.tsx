import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeFromCart, updateQuantity, toggleCart, setCartOpen } from '@/store/cartSlice';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useLocation } from 'wouter';
import { type Product } from '@shared/schema';

export function CartOffcanvas() {
  const [, setLocation] = useLocation();
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector(state => state.cart);

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  const getProductById = (id: number): Product | undefined => {
    return products.find(p => p.product_id === id);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = getProductById(item.product_id);
      if (product) {
        const price = product.discount_percentage && product.discount_percentage > 0
          ? parseFloat(product.price) * (1 - product.discount_percentage / 100)
          : parseFloat(product.price);
        return total + (price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    dispatch(updateQuantity({ product_id: productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    dispatch(setCartOpen(false));
    setLocation('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => dispatch(toggleCart())}
      />
      
      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => dispatch(toggleCart())}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const product = getProductById(item.product_id);
                if (!product) return null;

                const price = product.discount_percentage && product.discount_percentage > 0
                  ? parseFloat(product.price) * (1 - product.discount_percentage / 100)
                  : parseFloat(product.price);

                return (
                  <Card key={item.product_id} className="border-0 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.main_image_url || '/placeholder-image.jpg'}
                          alt={product.product_name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{product.product_name}</h4>
                          <p className="text-xs text-gray-600">
                            {item.selected_size && `Size: ${item.selected_size}`}
                            {item.selected_color && ` Color: ${item.selected_color}`}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium">${price.toFixed(2)}</span>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-500 p-1"
                          onClick={() => handleRemoveItem(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  dispatch(setCartOpen(false));
                  setLocation('/cart');
                }}
              >
                View Cart
              </Button>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
