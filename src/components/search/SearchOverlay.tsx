'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search,
  X,
  Sun,
  Construction,
  Package,
  BookOpen,
  Building2,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useSearchStore, useNavigationStore } from '@/lib/store';
import { allProducts, brands, blogPosts } from '@/lib/data';
import type { Product, Brand, BlogPost, PageId } from '@/lib/types';

/* ─── Popular Searches ─────────────────────────────────────────────────────── */

const popularSearches = [
  'Solar Panel 500W',
  'Overhead Crane',
  'MPPT Charge Controller',
  'LFP Battery',
  'Crane Motor',
  'Complete Solar Kit',
];

/* ─── Recent Searches Store (localStorage) ─────────────────────────────────── */

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('solarcrane-recent-searches');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentSearches().filter((s) => s !== query);
    recent.unshift(query);
    const trimmed = recent.slice(0, 8);
    localStorage.setItem(
      'solarcrane-recent-searches',
      JSON.stringify(trimmed)
    );
  } catch {
    // ignore
  }
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('solarcrane-recent-searches');
  } catch {
    // ignore
  }
}

/* ─── Search Result Types ──────────────────────────────────────────────────── */

interface ProductResult {
  type: 'product';
  id: string;
  name: string;
  category: Product['category'];
  subcategory: string;
  price: number;
  image: string;
  brand: string;
}

interface BrandResult {
  type: 'brand';
  id: string;
  name: string;
  category: Brand['category'];
  country: string;
  productCount: number;
}

interface CategoryResult {
  type: 'category';
  name: string;
  pageId: PageId;
  icon: React.ReactNode;
}

interface BlogResult {
  type: 'blog';
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
}

type SearchResult =
  | ProductResult
  | BrandResult
  | CategoryResult
  | BlogResult;

/* ─── Category Mapping ─────────────────────────────────────────────────────── */

const categoryMap: { name: string; pageId: PageId; icon: React.ReactNode }[] = [
  { name: 'Solar Panels', pageId: 'solar-panels', icon: <Sun className="size-4" /> },
  { name: 'Solar Inverters', pageId: 'solar-inverters', icon: <Sun className="size-4" /> },
  { name: 'Solar Batteries', pageId: 'solar-batteries', icon: <Sun className="size-4" /> },
  { name: 'Solar Structures', pageId: 'solar-structures', icon: <Sun className="size-4" /> },
  { name: 'Charge Controllers', pageId: 'solar-charge-controllers', icon: <Sun className="size-4" /> },
  { name: 'Solar Accessories', pageId: 'solar-accessories', icon: <Sun className="size-4" /> },
  { name: 'Complete Systems', pageId: 'solar-complete-systems', icon: <Sun className="size-4" /> },
  { name: 'Complete Cranes', pageId: 'crane-complete', icon: <Construction className="size-4" /> },
  { name: 'Crane Hooks', pageId: 'crane-hooks', icon: <Construction className="size-4" /> },
  { name: 'Wire Ropes', pageId: 'crane-wire-ropes', icon: <Construction className="size-4" /> },
  { name: 'Crane Bearings', pageId: 'crane-bearings', icon: <Construction className="size-4" /> },
  { name: 'Crane Motors', pageId: 'crane-motors', icon: <Construction className="size-4" /> },
  { name: 'Crane Gearboxes', pageId: 'crane-gearboxes', icon: <Construction className="size-4" /> },
  { name: 'Crane Brakes', pageId: 'crane-brakes', icon: <Construction className="size-4" /> },
  { name: 'Crane Electrical', pageId: 'crane-electrical', icon: <Construction className="size-4" /> },
  { name: 'Remote Controls', pageId: 'crane-remote-controls', icon: <Construction className="size-4" /> },
  { name: 'Crane Accessories', pageId: 'crane-accessories', icon: <Construction className="size-4" /> },
];

/* ─── Main SearchOverlay Component ─────────────────────────────────────────── */

export default function SearchOverlay() {
  const { query, setQuery, isSearchOpen, closeSearch } = useSearchStore();
  const navigate = useNavigationStore((s) => s.navigate);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const refreshRecent = useRef(() => {
    setRecentSearches(getRecentSearches());
  });

  // Auto-focus when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      refreshRecent.current();
    }
  }, [isSearchOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
      // Ctrl+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!isSearchOpen) {
          useSearchStore.getState().openSearch();
        } else {
          closeSearch();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Products
    const matchedProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
    );
    matchedProducts.slice(0, 8).forEach((p) => {
      results.push({
        type: 'product',
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price,
        image: p.images[0],
        brand: p.brand,
      });
    });

    // Categories
    categoryMap
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((c) => {
        results.push({
          type: 'category',
          name: c.name,
          pageId: c.pageId,
          icon: c.icon,
        });
      });

    // Brands
    brands
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.country.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((b) => {
        results.push({
          type: 'brand',
          id: b.id,
          name: b.name,
          category: b.category,
          country: b.country,
          productCount: b.productCount,
        });
      });

    // Blog posts
    blogPosts
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((b) => {
        results.push({
          type: 'blog',
          id: b.id,
          title: b.title,
          category: b.category,
          author: b.author,
          readTime: b.readTime,
        });
      });

    return results;
  }, [query]);

  // Grouped results
  const groupedResults = useMemo(() => {
    const groups: { title: string; icon: React.ReactNode; items: SearchResult[] }[] = [];
    const products = searchResults.filter((r) => r.type === 'product');
    const categories = searchResults.filter((r) => r.type === 'category');
    const brandResults = searchResults.filter((r) => r.type === 'brand');
    const blogs = searchResults.filter((r) => r.type === 'blog');

    if (products.length > 0) {
      groups.push({ title: 'Products', icon: <Package className="size-4" />, items: products });
    }
    if (categories.length > 0) {
      groups.push({ title: 'Categories', icon: <Sun className="size-4" />, items: categories });
    }
    if (brandResults.length > 0) {
      groups.push({ title: 'Brands', icon: <Building2 className="size-4" />, items: brandResults });
    }
    if (blogs.length > 0) {
      groups.push({ title: 'Blog Posts', icon: <BookOpen className="size-4" />, items: blogs });
    }

    return groups;
  }, [searchResults]);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      addRecentSearch(query);
      closeSearch();
      switch (result.type) {
        case 'product':
          navigate('product', result.id);
          break;
        case 'category':
          navigate(result.pageId);
          break;
        case 'brand':
          navigate('brands');
          break;
        case 'blog':
          navigate('blog');
          break;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [query, closeSearch, navigate]
  );

  const handleChipClick = useCallback(
    (chip: string) => {
      setQuery(chip);
      inputRef.current?.focus();
    },
    [setQuery]
  );

  const handleSubmitSearch = useCallback(() => {
    if (query.trim()) {
      addRecentSearch(query);
      closeSearch();
      // Navigate to the most relevant page
      const firstProduct = searchResults.find((r) => r.type === 'product');
      if (firstProduct && firstProduct.type === 'product') {
        navigate(firstProduct.category);
      } else {
        navigate('solar');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [query, searchResults, closeSearch, navigate]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeSearch}
          />

          {/* Overlay Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-3xl mx-auto mt-4 sm:mt-12 px-4"
          >
            {/* Search Input */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Input Row */}
              <div className="flex items-center gap-3 p-4 sm:p-5">
                <Search className="size-5 text-amber-500 shrink-0" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitSearch();
                  }}
                  placeholder="Search solar panels, crane parts, brands..."
                  className="border-0 text-base sm:text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto shadow-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="size-5" />
                  <span className="sr-only">Close search</span>
                </button>
              </div>

              <Separator />

              {/* Results Area */}
              <ScrollArea className="max-h-[70vh]">
                {query.trim() ? (
                  // Search Results
                  groupedResults.length > 0 ? (
                    <div className="p-4 space-y-5">
                      {groupedResults.map((group) => (
                        <div key={group.title}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-600">{group.icon}</span>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                              {group.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-bold"
                            >
                              {group.items.length}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            {group.items.map((result, idx) => {
                              if (result.type === 'product') {
                                return (
                                  <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleResultClick(result)}
                                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-amber-50 transition-colors group"
                                  >
                                    <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                      <Image
                                        src={result.image}
                                        alt={result.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, 150px"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                                        {result.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <Badge
                                          className={`text-[10px] font-bold border-0 px-1.5 py-0 ${
                                            result.category === 'solar'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-gray-200 text-gray-700'
                                          }`}
                                        >
                                          {result.category === 'solar'
                                            ? '☀️ Solar'
                                            : '🏗️ Crane'}
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                          {result.brand}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-sm font-bold text-amber-600 shrink-0">
                                      ${result.price.toLocaleString()}
                                    </span>
                                    <ChevronRight className="size-4 text-gray-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                                  </button>
                                );
                              }

                              if (result.type === 'category') {
                                return (
                                  <button
                                    key={`${result.type}-${result.name}`}
                                    onClick={() => handleResultClick(result)}
                                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-amber-50 transition-colors group"
                                  >
                                    <div className="flex items-center justify-center size-10 rounded-lg bg-amber-100 text-amber-600 shrink-0">
                                      {result.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                                        {result.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Browse all products
                                      </p>
                                    </div>
                                    <ChevronRight className="size-4 text-gray-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                                  </button>
                                );
                              }

                              if (result.type === 'brand') {
                                return (
                                  <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleResultClick(result)}
                                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-amber-50 transition-colors group"
                                  >
                                    <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 text-gray-600 shrink-0">
                                      <Building2 className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                                        {result.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <Badge
                                          className={`text-[10px] font-bold border-0 px-1.5 py-0 ${
                                            result.category === 'solar'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-gray-200 text-gray-700'
                                          }`}
                                        >
                                          {result.category === 'solar'
                                            ? '☀️ Solar'
                                            : '🏗️ Crane'}
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                          {result.country} &bull;{' '}
                                          {result.productCount} products
                                        </span>
                                      </div>
                                    </div>
                                    <ChevronRight className="size-4 text-gray-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                                  </button>
                                );
                              }

                              if (result.type === 'blog') {
                                return (
                                  <button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleResultClick(result)}
                                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-amber-50 transition-colors group"
                                  >
                                    <div className="flex items-center justify-center size-10 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                                      <BookOpen className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                                        {result.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <Badge className="text-[10px] font-bold border-0 px-1.5 py-0 bg-purple-100 text-purple-700">
                                          {result.category
                                            .replace('-', ' ')
                                            .toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                          {result.readTime}
                                        </span>
                                      </div>
                                    </div>
                                    <ChevronRight className="size-4 text-gray-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                                  </button>
                                );
                              }

                              return null;
                            })}
                          </div>
                        </div>
                      ))}

                      {/* View All Results Button */}
                      <div className="pt-2">
                        <Button
                          onClick={handleSubmitSearch}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
                        >
                          View All Results for &quot;{query}&quot;
                          <ArrowRight className="size-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // No results
                    <div className="p-8 text-center">
                      <Search className="size-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        No results found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search terms or browse our categories
                      </p>
                    </div>
                  )
                ) : (
                  // Default State (no query)
                  <div className="p-4 space-y-5">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <Clock className="size-3" />
                            Recent Searches
                          </h3>
                          <button
                            onClick={() => {
                              clearRecentSearches();
                              setRecentSearches([]);
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleChipClick(term)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                            >
                              <Clock className="size-3" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-2">
                        <TrendingUp className="size-3" />
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleChipClick(term)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-sm text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200"
                          >
                            <Sparkles className="size-3" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mb-2">
                        Quick Links
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            label: 'Solar Panels',
                            pageId: 'solar-panels' as PageId,
                            icon: <Sun className="size-4" />,
                          },
                          {
                            label: 'Complete Cranes',
                            pageId: 'crane-complete' as PageId,
                            icon: <Construction className="size-4" />,
                          },
                          {
                            label: 'All Brands',
                            pageId: 'brands' as PageId,
                            icon: <Building2 className="size-4" />,
                          },
                          {
                            label: 'Blog',
                            pageId: 'blog' as PageId,
                            icon: <BookOpen className="size-4" />,
                          },
                        ].map((link) => (
                          <button
                            key={link.pageId}
                            onClick={() => {
                              closeSearch();
                              navigate(link.pageId);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors text-left"
                          >
                            <span className="text-amber-500">{link.icon}</span>
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
