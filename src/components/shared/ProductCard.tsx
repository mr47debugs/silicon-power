'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { useWishlistStore } from '@/lib/store';
import { useCompareStore } from '@/lib/store';
import { useNavigationStore } from '@/lib/store';
import type { Product } from '@/lib/types';
import {
  Heart,
  ShoppingCart,
  Zap,
  MessageCircle,
  GitCompareArrows,
  Star,
  Eye,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const availabilityConfig = {
  'in-stock': { label: 'In Stock', color: 'bg-emerald-500', textColor: 'text-emerald-50' },
  limited: { label: 'Limited', color: 'bg-amber-500', textColor: 'text-amber-50' },
  'pre-order': { label: 'Pre-Order', color: 'bg-blue-500', textColor: 'text-blue-50' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-50' },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">({rating})</span>
    </div>
  );
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const navigate = useNavigationStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { items: compareItems, addItem: addToCompare, removeItem: removeFromCompare } = useCompareStore();

  const isInWishlist = wishlistItems.some((i) => i.product.id === product.id);
  const isInCompare = compareItems.some((i) => i.product.id === product.id);
  const compareFull = compareItems.length >= 4;

  const avail = availabilityConfig[product.availability];
  const keySpec = product.power || product.capacity || '';
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(product.id);
    } else if (!compareFull) {
      addToCompare(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    navigate('cart');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(`Hi, I'm interested in: ${product.name} (ID: ${product.id})`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleCardClick = () => {
    navigate('product', product.id);
  };

  return (
    <Card
      className="group relative overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer py-0 gap-0"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={product.images[0] || '/logo.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isNew && (
            <Badge className="bg-emerald-500 text-white border-0 text-[10px] px-1.5 py-0.5 font-bold">
              NEW
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-amber-500 text-white border-0 text-[10px] px-1.5 py-0.5 font-bold">
              BEST SELLER
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-red-500 text-white border-0 text-[10px] px-1.5 py-0.5 font-bold">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 z-10 size-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:scale-110 hover:bg-white"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`size-4 transition-colors ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Quick view on hover */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Button
            size="sm"
            variant="secondary"
            className="w-full bg-white/90 backdrop-blur-sm hover:bg-white text-xs h-8"
            onClick={(e) => {
              e.stopPropagation();
              navigate('product', product.id);
            }}
          >
            <Eye className="size-3.5 mr-1" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-3 sm:p-4 space-y-2">
        {/* Brand + Availability row */}
        <div className="flex items-center justify-between gap-1">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-semibold text-gray-700 border-gray-300">
            {product.brand}
          </Badge>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${avail.color} ${avail.textColor}`}
          >
            {avail.label}
          </span>
        </div>

        {/* Product name */}
        <h3 className="font-semibold text-sm leading-tight text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Key spec */}
        {keySpec && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Zap className="size-3 text-amber-500" />
            <span className="font-medium">{keySpec}</span>
          </div>
        )}

        {/* Rating */}
        <StarRating rating={product.rating} />

        {/* Price */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.estimatedPrice && (
            <p className="text-[10px] text-gray-400 italic">{product.estimatedPrice}</p>
          )}
        </div>

        {/* Action buttons */}
        {!compact && (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white h-8 text-xs font-semibold"
                onClick={handleAddToCart}
                disabled={product.availability === 'out-of-stock'}
              >
                <ShoppingCart className="size-3.5 mr-1" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-gray-900 hover:bg-gray-800 text-white h-8 text-xs font-semibold"
                onClick={handleBuyNow}
                disabled={product.availability === 'out-of-stock'}
              >
                Buy Now
              </Button>
            </div>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className={`flex-1 h-7 text-[10px] ${
                  isInCompare
                    ? 'border-amber-500 text-amber-600 bg-amber-50'
                    : 'border-gray-200 text-gray-600'
                }`}
                onClick={handleCompareToggle}
                disabled={!isInCompare && compareFull}
              >
                <GitCompareArrows className="size-3 mr-0.5" />
                {isInCompare ? 'Comparing' : compareFull ? 'Full' : 'Compare'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-7 text-[10px] border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="size-3 mr-0.5" />
                WhatsApp
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
