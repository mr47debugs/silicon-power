'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal, X, ChevronRight, Home } from 'lucide-react';
import { useNavigationStore } from '@/lib/store';
import { solarProducts } from '@/lib/data';
import type { SortOption, SolarSubcategory } from '@/lib/types';
import ProductCard from '@/components/shared/ProductCard';

const CATEGORY_MAP: Record<string, { title: string; description: string; subcategory: SolarSubcategory }> = {
  'solar-panels': { title: 'Solar Panels', description: 'High-efficiency monocrystalline and polycrystalline solar panels from world-leading manufacturers. Find the perfect panel for residential, commercial, or utility-scale installations.', subcategory: 'panels' },
  'solar-inverters': { title: 'Solar Inverters', description: 'String inverters, hybrid inverters, and microinverters with advanced MPPT technology. Convert solar DC power to usable AC with maximum efficiency.', subcategory: 'inverters' },
  'solar-batteries': { title: 'Solar Batteries', description: 'Lithium iron phosphate (LFP) battery storage systems for residential and commercial solar installations. Store excess energy for use when you need it most.', subcategory: 'batteries' },
  'solar-structures': { title: 'Solar Structures & Mounting', description: 'Roof-mount rails, ground-mount racking, and structural systems engineered for maximum durability and easy installation.', subcategory: 'structures' },
  'solar-charge-controllers': { title: 'Charge Controllers', description: 'MPPT and PWM charge controllers for off-grid and hybrid solar systems. Maximize energy harvest with intelligent charge management.', subcategory: 'charge-controllers' },
  'solar-accessories': { title: 'Solar Accessories', description: 'MC4 connectors, solar cables, DC isolators, surge protection devices, and all essential accessories for professional solar installations.', subcategory: 'accessories' },
  'solar-complete-systems': { title: 'Complete Solar Systems', description: 'Pre-engineered residential, commercial, and industrial solar kits with everything included. From panels to inverters, mounting, and accessories.', subcategory: 'complete-systems' },
};

const ITEMS_PER_PAGE = 9;

export default function SolarCategoryPage() {
  const { selectedCategory, navigate } = useNavigationStore();
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);

  const categoryInfo = selectedCategory && CATEGORY_MAP[selectedCategory]
    ? CATEGORY_MAP[selectedCategory]
    : { title: 'All Solar Products', description: 'Browse our complete range of solar energy products including panels, inverters, batteries, and complete systems.', subcategory: null as SolarSubcategory | null };

  // Available filter options from current product set
  const baseProducts = useMemo(() => {
    if (categoryInfo.subcategory) {
      return solarProducts.filter((p) => p.subcategory === categoryInfo.subcategory);
    }
    return solarProducts;
  }, [categoryInfo.subcategory]);

  const availableBrands = useMemo(() => [...new Set(baseProducts.map((p) => p.brand))], [baseProducts]);
  const availableTechnologies = useMemo(
    () => [...new Set(baseProducts.filter((p) => p.technology).map((p) => p.technology!))],
    [baseProducts]
  );

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let products = baseProducts;

    if (selectedBrands.length > 0) {
      products = products.filter((p) => selectedBrands.includes(p.brand));
    }
    products = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedTechnologies.length > 0) {
      products = products.filter((p) => p.technology && selectedTechnologies.includes(p.technology));
    }
    if (selectedAvailabilities.length > 0) {
      products = products.filter((p) => selectedAvailabilities.includes(p.availability));
    }

    switch (sortBy) {
      case 'newest':
        return [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return [...products].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }
  }, [baseProducts, selectedBrands, priceRange, selectedTechnologies, selectedAvailabilities, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }, []);

  const toggleTechnology = useCallback((tech: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }, []);

  const toggleAvailability = useCallback((avail: string) => {
    setSelectedAvailabilities((prev) =>
      prev.includes(avail) ? prev.filter((a) => a !== avail) : [...prev, avail]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setSelectedTechnologies([]);
    setSelectedAvailabilities([]);
  }, []);

  const activeFilterCount =
    selectedBrands.length +
    selectedTechnologies.length +
    selectedAvailabilities.length +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0);

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="border-gray-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          min={0}
          max={50000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      {/* Technology */}
      {availableTechnologies.length > 0 && (
        <>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Technology</h4>
            <div className="space-y-2">
              {availableTechnologies.map((tech) => (
                <label key={tech} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedTechnologies.includes(tech)}
                    onCheckedChange={() => toggleTechnology(tech)}
                    className="border-gray-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{tech}</span>
                </label>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Availability */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Availability</h4>
        <div className="space-y-2">
          {['in-stock', 'limited', 'pre-order'].map((avail) => (
            <label key={avail} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedAvailabilities.includes(avail)}
                onCheckedChange={() => toggleAvailability(avail)}
                className="border-gray-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <span className="text-sm text-gray-700 capitalize">{avail.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" /> Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

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
              <BreadcrumbLink onClick={() => navigate('solar')} className="cursor-pointer text-gray-500 hover:text-yellow-600">
                Solar
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-sm font-medium text-gray-900">{categoryInfo.title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {categoryInfo.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl">
            {categoryInfo.description}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilterCount > 0 && (
                  <Badge className="bg-yellow-500 text-black text-[10px] h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </h3>
              {filterSidebarContent}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="bg-yellow-500 text-black text-[10px] ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetTitle className="mb-4">Filters</SheetTitle>
                    {filterSidebarContent}
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
                </span>
              </div>

              <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                <SelectTrigger className="w-[180px] h-9 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedBrands.map((b) => (
                  <Badge key={b} variant="secondary" className="gap-1 pr-1">
                    {b}
                    <button onClick={() => toggleBrand(b)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedTechnologies.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1 pr-1">
                    {t}
                    <button onClick={() => toggleTechnology(t)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedAvailabilities.map((a) => (
                  <Badge key={a} variant="secondary" className="gap-1 pr-1 capitalize">
                    {a.replace('-', ' ')}
                    <button onClick={() => toggleAvailability(a)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    <button onClick={() => setPriceRange([0, 50000])} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Product Grid */}
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <SlidersHorizontal className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters to find what you are looking for.</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-black"
                >
                  Load More Products
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
