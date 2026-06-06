'use client';

import { useMemo } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { X, GitCompare, Home, ArrowRight } from 'lucide-react';
import { useNavigationStore } from '@/lib/store';
import { useCompareStore } from '@/lib/store';

export default function ComparePage() {
  const { navigate } = useNavigationStore();
  const { items, removeItem, clearCompare } = useCompareStore();

  // Get all specification keys across all compared products
  const allSpecKeys = useMemo(() => {
    const keySet = new Set<string>();
    items.forEach((item) => {
      Object.keys(item.product.specifications).forEach((key) => keySet.add(key));
    });
    return Array.from(keySet);
  }, [items]);

  // Check if a spec value differs across products
  const isDifferent = useMemo(() => {
    const diffMap: Record<string, boolean> = {};
    allSpecKeys.forEach((key) => {
      const values = items.map((item) => item.product.specifications[key]);
      const uniqueValues = new Set(values);
      diffMap[key] = uniqueValues.size > 1;
    });
    return diffMap;
  }, [allSpecKeys, items]);

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
                <span className="text-sm font-medium text-gray-900">Compare</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center py-20">
            <GitCompare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Products to Compare</h1>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Add products to your comparison list to see them side by side. You can add up to 4 products at a time.
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

  // Less than 2 products state
  const showAddMore = items.length < 2;

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
              <span className="text-sm font-medium text-gray-900">Compare</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Compare Products</h1>
            <p className="text-gray-500 text-sm mt-1">
              Comparing {items.length} of 4 products
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearCompare} className="text-red-600 border-red-200 hover:bg-red-50">
            <X className="h-4 w-4 mr-1" /> Clear All
          </Button>
        </div>

        {/* Add More Banner */}
        {showAddMore && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm text-yellow-800">
                Add at least {2 - items.length} more product{2 - items.length > 1 ? 's' : ''} to see a meaningful comparison.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate('solar')} className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">
                  Add Solar
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('crane')} className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">
                  Add Crane
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Cards Row */}
        <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((item) => {
            const product = item.product;
            return (
              <Card key={product.id} className="border border-gray-200 overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md bg-white hover:bg-red-50"
                    onClick={() => removeItem(product.id)}
                  >
                    <X className="h-3.5 w-3.5 text-red-600" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <p className="text-[11px] font-medium text-yellow-600 uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <h3
                    className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-yellow-600 min-h-[2.5rem] leading-tight"
                    onClick={() => navigate('product', product.id)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-black">
                    ${product.price.toLocaleString()}
                  </p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40 bg-gray-50 font-semibold sticky left-0 z-10">Feature</TableHead>
                {items.map((item) => (
                  <TableHead key={item.product.id} className="bg-gray-50 font-semibold text-center min-w-[200px]">
                    {item.product.name.length > 30 ? item.product.name.substring(0, 30) + '...' : item.product.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Price Row */}
              <TableRow>
                <TableCell className="font-medium text-sm bg-gray-50/50 sticky left-0">Price</TableCell>
                {items.map((item) => (
                  <TableCell key={item.product.id} className="text-center font-bold text-sm">
                    ${item.product.price.toLocaleString()}
                    {item.product.originalPrice && (
                      <span className="block text-xs text-gray-400 line-through font-normal">
                        ${item.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Brand Row */}
              <TableRow>
                <TableCell className="font-medium text-sm bg-gray-50/50 sticky left-0">Brand</TableCell>
                {items.map((item) => (
                  <TableCell key={item.product.id} className="text-center text-sm text-gray-700">
                    {item.product.brand}
                  </TableCell>
                ))}
              </TableRow>

              {/* Rating Row */}
              <TableRow>
                <TableCell className="font-medium text-sm bg-gray-50/50 sticky left-0">Rating</TableCell>
                {items.map((item) => (
                  <TableCell key={item.product.id} className="text-center text-sm">
                    <span className="font-semibold">{item.product.rating}</span>
                    <span className="text-gray-400 text-xs ml-1">({item.product.reviewCount})</span>
                  </TableCell>
                ))}
              </TableRow>

              {/* Availability Row */}
              <TableRow>
                <TableCell className="font-medium text-sm bg-gray-50/50 sticky left-0">Availability</TableCell>
                {items.map((item) => {
                  const availMap: Record<string, string> = {
                    'in-stock': 'In Stock',
                    limited: 'Limited',
                    'pre-order': 'Pre-Order',
                    'out-of-stock': 'Out of Stock',
                  };
                  return (
                    <TableCell key={item.product.id} className="text-center">
                      <Badge variant="outline" className="text-[11px] capitalize">
                        {availMap[item.product.availability] || item.product.availability}
                      </Badge>
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Warranty Row */}
              <TableRow>
                <TableCell className="font-medium text-sm bg-gray-50/50 sticky left-0">Warranty</TableCell>
                {items.map((item) => (
                  <TableCell key={item.product.id} className="text-center text-sm text-gray-700">
                    {item.product.warranty}
                  </TableCell>
                ))}
              </TableRow>

              {/* Specifications */}
              {allSpecKeys.map((key) => (
                <TableRow key={key}>
                  <TableCell className="font-medium text-sm bg-gray-50/50 sticky left-0">
                    {key}
                    {isDifferent[key] && (
                      <Badge className="ml-1.5 bg-yellow-100 text-yellow-700 text-[9px] px-1 py-0">
                        DIFF
                      </Badge>
                    )}
                  </TableCell>
                  {items.map((item) => (
                    <TableCell
                      key={item.product.id}
                      className={`text-center text-sm ${
                        isDifferent[key] ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {item.product.specifications[key] || '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
