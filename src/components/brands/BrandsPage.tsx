'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Building2,
  Sun,
  Construction,
  ArrowRight,
  MapPin,
  Package,
  Star,
  Filter,
  Globe,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigationStore } from '@/lib/store';
import { brands, allProducts } from '@/lib/data';
import type { ProductCategory } from '@/lib/types';

/* ─── Filter Tabs ─────────────────────────────────────────────────────────── */

const filterTabs = [
  { id: 'all' as const, label: 'All Brands', icon: Building2 },
  { id: 'solar' as const, label: 'Solar', icon: Sun },
  { id: 'crane' as const, label: 'Crane', icon: Construction },
] as const;

type FilterType = 'all' | ProductCategory;

/* ─── Country Flag Helper ──────────────────────────────────────────────────── */

function CountryFlag({ country }: { country: string }) {
  const flags: Record<string, string> = {
    China: '🇨🇳',
    Germany: '🇩🇪',
    Finland: '🇫🇮',
    Switzerland: '🇨🇭',
    USA: '🇺🇸',
    Japan: '🇯🇵',
    Netherlands: '🇳🇱',
    SouthKorea: '🇰🇷',
  };
  return <span title={country}>{flags[country] || '🌍'}</span>;
}

/* ─── Brand Card ───────────────────────────────────────────────────────────── */

function BrandCard({
  brand,
  isFeatured = false,
}: {
  brand: (typeof brands)[number];
  isFeatured?: boolean;
}) {
  const navigate = useNavigationStore((s) => s.navigate);
  const productCount = useMemo(
    () => allProducts.filter((p) => p.brand === brand.name).length,
    [brand.name]
  );

  const handleViewProducts = () => {
    const category = brand.category as ProductCategory;
    navigate(category, null, brand.name);
  };

  if (isFeatured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="group overflow-hidden border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:border-amber-300 py-0 gap-0">
          <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 flex h-full items-center justify-center p-6">
              <div className="relative w-48 h-20">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
            <Badge className="absolute top-3 right-3 bg-amber-500 text-black border-0 text-xs font-bold">
              FEATURED
            </Badge>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
              <CountryFlag country={brand.country} />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
              {brand.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Package className="size-4" />
                  {productCount} Products
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {brand.country}
                </span>
              </div>
            </div>
            <Button
              onClick={handleViewProducts}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
            >
              View Products
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:border-amber-300 py-0 gap-0">
        <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="relative w-36 h-12">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <Badge
            className={`absolute top-2 right-2 text-[10px] font-bold border-0 ${
              brand.category === 'solar'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {brand.category === 'solar' ? '☀️ Solar' : '🏗️ Crane'}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{brand.name}</h3>
            <CountryFlag country={brand.country} />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {brand.description}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Package className="size-3" />
              {productCount} Products
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-amber-600 hover:text-amber-700 font-semibold text-xs h-7 px-2"
              onClick={handleViewProducts}
            >
              View Products
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Main BrandsPage Component ────────────────────────────────────────────── */

export default function BrandsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = useMemo(() => {
    let result = brands;
    if (activeFilter !== 'all') {
      result = result.filter((b) => b.category === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.country.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

  const featuredBrands = filteredBrands.slice(0, 2);
  const regularBrands = filteredBrands.slice(2);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#1a1a2e] to-[#0a3d62] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <Badge className="bg-amber-500 text-black border-0 font-bold mb-4">
              <Globe className="size-3 mr-1" />
              TRUSTED PARTNERS
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Our Partner Brands
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              We partner with world-leading manufacturers to bring you genuine,
              high-quality solar and crane products. Every brand in our catalog
              is vetted for quality, reliability, and after-sales support.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-amber-400 font-semibold">
                <Building2 className="size-5" />
                {brands.length} Partner Brands
              </span>
              <span className="flex items-center gap-2 text-gray-400">
                <Package className="size-5" />
                {allProducts.length}+ Products
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Filter & Search ──────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {filterTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeFilter === tab.id
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 border-gray-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Brands ──────────────────────────────────────────────── */}
      {featuredBrands.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="size-6 text-amber-500" />
              Featured Brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredBrands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  isFeatured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── All Brands Grid ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {activeFilter === 'all'
              ? 'All Brands'
              : activeFilter === 'solar'
              ? 'Solar Brands'
              : 'Crane Brands'}
          </h2>
          {regularBrands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {regularBrands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No brands found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
