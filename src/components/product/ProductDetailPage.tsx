'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  ShoppingCart,
  Heart,
  GitCompare,
  Share2,
  Truck,
  Shield,
  Check,
  Minus,
  Plus,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
} from 'lucide-react';
import { useNavigationStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import { useWishlistStore } from '@/lib/store';
import { useCompareStore } from '@/lib/store';
import { allProducts, customerReviews } from '@/lib/data';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/shared/ProductCard';

export default function ProductDetailPage() {
  const { selectedProductId, navigate } = useNavigationStore();
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addCompare } = useCompareStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const product = useMemo(
    () => allProducts.find((p) => p.id === selectedProductId),
    [selectedProductId]
  );

  const productReviews = useMemo(
    () => (product ? customerReviews.filter((r) => r.productId === product.id) : []),
    [product]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return product.relatedProductIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [product]);

  const wishlisted = product ? isInWishlist(product.id) : false;

  const starBreakdown = useMemo(() => {
    const breakdown = [0, 0, 0, 0, 0];
    productReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) breakdown[r.rating - 1]++;
    });
    return breakdown.reverse(); // 5 stars first
  }, [productReviews]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!product) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    [product]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-4">The product you are looking for does not exist.</p>
          <Button onClick={() => navigate('home')} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const availabilityConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
    'in-stock': { label: 'In Stock', variant: 'default', color: 'text-green-700 bg-green-50 border-green-200' },
    'limited': { label: 'Limited Stock', variant: 'secondary', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    'pre-order': { label: 'Pre-Order', variant: 'outline', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    'out-of-stock': { label: 'Out of Stock', variant: 'destructive', color: 'text-red-700 bg-red-50 border-red-200' },
  };
  const avail = availabilityConfig[product.availability] || availabilityConfig['in-stock'];

  const categoryLabel =
    product.category === 'solar' ? 'Solar' : 'Crane';

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in:\n\n${product.name}\nPrice: $${product.price.toLocaleString()}\n\nCan you provide more details?`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const shareMessage = encodeURIComponent(
    `Check out this product: ${product.name} - $${product.price.toLocaleString()}`
  );
  const shareUrl = `https://wa.me/?text=${shareMessage}`;

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
              <BreadcrumbLink
                onClick={() => navigate(product.category === 'solar' ? 'solar' : 'crane')}
                className="cursor-pointer text-gray-500 hover:text-yellow-600"
              >
                {categoryLabel}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image with Zoom */}
            <div
              className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={product.images[selectedImage] || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200"
                style={
                  isZooming
                    ? { transform: 'scale(2)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                    : {}
                }
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold">
                  -{discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-3 right-3 bg-black text-white font-bold">New</Badge>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === idx ? 'border-yellow-500 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Brand */}
            <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-1">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Availability */}
            <Badge variant={avail.variant} className={`mb-4 ${avail.color}`}>
              {avail.label}
            </Badge>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-black">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.estimatedPrice && (
                <p className="text-sm text-gray-500 mt-1">{product.estimatedPrice}</p>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDescription}</p>

            <Separator className="mb-6" />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  disabled={quantity >= 99}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-sm col-span-2"
                onClick={() => addItem(product, quantity)}
                disabled={product.availability === 'out-of-stock'}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                className="bg-black hover:bg-gray-800 text-white font-bold h-12 text-sm"
                onClick={() => {
                  addItem(product, quantity);
                  navigate('cart');
                }}
                disabled={product.availability === 'out-of-stock'}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="h-12 text-sm font-semibold border-gray-300"
                onClick={() => {
                  if (wishlisted) removeWishlist(product.id);
                  else addWishlist(product);
                }}
              >
                <Heart className={`h-4 w-4 mr-2 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                Wishlist
              </Button>
              <Button
                variant="outline"
                className="h-12 text-sm font-semibold border-gray-300"
                onClick={() => addCompare(product)}
              >
                <GitCompare className="h-4 w-4 mr-2" /> Compare
              </Button>
              <Button
                variant="outline"
                className="h-12 text-sm font-semibold border-green-500 text-green-600 hover:bg-green-50"
                asChild
              >
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                </a>
              </Button>
            </div>

            <Separator className="mb-6" />

            {/* Delivery Info */}
            <div className="flex items-start gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <Truck className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Estimated Delivery</p>
                <p className="text-xs text-gray-500">
                  {product.availability === 'in-stock'
                    ? '3-7 business days'
                    : product.availability === 'pre-order'
                    ? '2-4 weeks (pre-order)'
                    : product.availability === 'limited'
                    ? '5-10 business days'
                    : 'Currently unavailable'}
                </p>
              </div>
            </div>

            {/* Warranty Info */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Warranty</p>
                <p className="text-xs text-gray-500">{product.warranty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            {['description', 'specifications', 'features', 'reviews'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="px-6 py-3 text-sm font-semibold capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-gray-600 data-[state=active]:text-black"
              >
                {tab}
                {tab === 'reviews' && (
                  <span className="ml-1.5 text-xs text-gray-400">({product.reviewCount})</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 bg-gray-50 font-semibold">Specification</TableHead>
                  <TableHead className="bg-gray-50 font-semibold">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <TableRow key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <TableCell className="font-medium text-gray-900 text-sm">{key}</TableCell>
                    <TableCell className="text-gray-700 text-sm">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="features" className="pt-6">
            <ul className="space-y-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                  <div className="flex items-center justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{product.reviewCount} reviews</p>

                  <Separator className="my-4" />

                  {/* Star Breakdown */}
                  <div className="space-y-2">
                    {starBreakdown.map((count, idx) => {
                      const starValue = 5 - idx;
                      const percentage = product.reviewCount > 0 ? (count / product.reviewCount) * 100 : 0;
                      return (
                        <div key={starValue} className="flex items-center gap-2 text-sm">
                          <span className="w-3 text-right text-gray-600">{starValue}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="md:col-span-2">
                {productReviews.length > 0 ? (
                  <div className="space-y-6">
                    {productReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet for this product.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Bulk Order CTA */}
        <div className="bg-black rounded-xl p-8 sm:p-10 text-center">
          <Package className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Need a Bulk Order?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto text-sm">
            Get special pricing for orders of 10+ units. Contact our sales team for customized quotes and dedicated support.
          </p>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 px-8"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact for Bulk Order
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
