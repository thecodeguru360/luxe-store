import { useState } from 'react';
import { useLocation } from 'wouter';
import { CreditCard, Lock, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateQuantity, removeFromCart, clearCart } from '@/store/cartSlice';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Please select a country'),
  paymentMethod: z.enum(['credit-card', 'paypal']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
  sameAsBilling: z.boolean().default(true),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const [, setLocation] = useLocation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const cartItems = useAppSelector(state => state.cart.items);

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(),
  });

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit-card',
      sameAsBilling: true,
    },
  });

  const getProductById = (id: number) => {
    return products.find(p => p.product_id === id);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
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

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    dispatch(updateQuantity({ product_id: productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const onSubmit = (data: CheckoutForm) => {
    // TODO: Implement actual order processing
    console.log('Order data:', data);
    
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    });
    
    dispatch(clearCart());
    setLocation('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart to proceed with checkout.</p>
          <Button onClick={() => setLocation('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Billing Information</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sameAsBilling" 
                        checked={form.watch('sameAsBilling')}
                        onCheckedChange={(checked) => form.setValue('sameAsBilling', checked as boolean)}
                      />
                      <Label htmlFor="sameAsBilling" className="text-sm">Same as shipping</Label>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-4"
                          >
                            <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                              <RadioGroupItem value="credit-card" id="credit-card" />
                              <Label htmlFor="credit-card" className="flex items-center space-x-2 cursor-pointer">
                                <CreditCard className="h-5 w-5" />
                                <span>Credit Card</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">P</div>
                                <span>PayPal</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('paymentMethod') === 'credit-card' && (
                    <div className="space-y-4 pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const product = getProductById(item.product_id);
                      if (!product) return null;

                      const price = product.discount_percentage && product.discount_percentage > 0
                        ? parseFloat(product.price) * (1 - product.discount_percentage / 100)
                        : parseFloat(product.price);

                      return (
                        <div key={item.product_id} className="flex items-center space-x-3 py-3 border-b">
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
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-medium">${price.toFixed(2)}</span>
                              <div className="flex items-center space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm w-6 text-center">{item.quantity}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                  onClick={() => handleRemoveItem(item.product_id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
                    Place Order
                  </Button>

                  {/* Security Badge */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Lock className="h-4 w-4" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
