'use client';

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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Trash2, Home, X } from 'lucide-react';
import { useNavigationStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import { useWishlistStore } from '@/lib/store';

export default function WishlistPage() {
  const { navigate } = useNavigationStore();
  const addItem = useCartStore((s) => s.addItem);
  const { items, removeItem, clearWishlist } = useWishlistStore();

  // Empty state
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
                <span className="text-sm font-medium text-gray-900">Wishlist</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Save products you are interested in to your wishlist. You can easily find them later and move them to your cart when ready.
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
              <span className="text-sm font-medium text-gray-900">Wishlist</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearWishlist}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear All
          </Button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => {
            const product = item.product;
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <Card
                key={product.id}
                className="group relative overflow-hidden border border-gray-200 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg bg-white"
              >
                {/* Image */}
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => navigate('product', product.id)}
                >
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isBestSeller && (
                      <Badge className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5">
                        Best Seller
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-black text-white text-[10px] font-bold px-2 py-0.5">
                        New
                      </Badge>
                    )}
                    {discount > 0 && (
                      <Badge className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5">
                        -{discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md bg-white hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(product.id);
                    }}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                {/* Content */}
                <CardContent className="p-3 sm:p-4">
                  <p className="text-[11px] font-medium text-yellow-600 uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <h3
                    className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 cursor-pointer hover:text-yellow-600 min-h-[2.5rem] leading-tight"
                    onClick={() => navigate('product', product.id)}
                  >
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-black">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {product.estimatedPrice && (
                      <span className="text-[11px] text-gray-500">{product.estimatedPrice}</span>
                    )}
                  </div>

                  <Separator className="mb-3" />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-9"
                      onClick={() => {
                        addItem(product);
                        removeItem(product.id);
                      }}
                      disabled={product.availability === 'out-of-stock'}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      Move to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-3 border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-300"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
