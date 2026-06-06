'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Home,
  ArrowLeft,
  MessageCircle,
  Tag,
  Truck,
  Shield,
} from 'lucide-react';
import { useNavigationStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const { navigate } = useNavigationStore();
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const [couponCode, setCouponCode] = useState('');

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const estimatedShipping = subtotal > 5000 ? 0 : subtotal > 0 ? 99 : 0;
  const total = subtotal + estimatedShipping;

  // WhatsApp message generation
  const whatsappMessage = encodeURIComponent(
    `Hi, I'd like to place an order:\n\n${items
      .map(
        (item) =>
          `• ${item.product.name} × ${item.quantity} = $${(item.product.price * item.quantity).toLocaleString()}`
      )
      .join('\n')}\n\nSubtotal: $${subtotal.toLocaleString()}\nTotal: $${total.toLocaleString()}\n\nPlease confirm availability and delivery timeline.`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer text-gray-500 hover:text-yellow-600">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-sm font-medium text-gray-900">Shopping Cart</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center py-20">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you have not added any products yet. Start browsing our catalog to find what you need.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate('solar')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                Browse Solar
              </Button>
              <Button
                onClick={() => navigate('crane')}
                variant="outline"
                className="font-bold border-black text-black hover:bg-black hover:text-white"
              >
                Browse Crane
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer text-gray-500 hover:text-yellow-600">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-sm font-medium text-gray-900">Shopping Cart</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('home')} className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              return (
                <Card key={item.product.id} className="border border-gray-200 overflow-hidden">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                        onClick={() => navigate('product', item.product.id)}
                      >
                        <Image
                          src={item.product.images[0] || '/placeholder.png'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-yellow-600 uppercase tracking-wider">
                              {item.product.brand}
                            </p>
                            <h3
                              className="text-sm font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-yellow-600"
                              onClick={() => navigate('product', item.product.id)}
                            >
                              {item.product.name}
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm font-bold text-black mt-1">
                          ${item.product.price.toLocaleString()}
                          {item.product.estimatedPrice && (
                            <span className="text-xs text-gray-400 font-normal ml-1">{item.product.estimatedPrice}</span>
                          )}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Line Total */}
                          <p className="text-base font-bold text-black">
                            ${lineTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
              </Button>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 sticky top-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {estimatedShipping === 0 ? 'Free' : `$${estimatedShipping}`}
                    </span>
                  </div>
                  {estimatedShipping === 0 && subtotal > 0 && (
                    <p className="text-xs text-green-600">
                      <Truck className="h-3 w-3 inline mr-1" />
                      Free shipping on orders over $5,000
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-black">${total.toLocaleString()}</span>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Coupon Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Button variant="outline" size="sm" className="h-9 px-3 flex-shrink-0">
                      <Tag className="h-3.5 w-3.5 mr-1" /> Apply
                    </Button>
                  </div>
                </div>

                {/* Checkout Button - WhatsApp */}
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 mb-3"
                  asChild
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </a>
                </Button>

                {/* WhatsApp Order Button */}
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 font-semibold h-10 mb-3"
                  asChild
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Order via WhatsApp
                  </a>
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 font-medium h-10"
                  onClick={() => navigate('home')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
                </Button>

                {/* Trust Signals */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">Secure payment via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">Free shipping on orders over $5,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
