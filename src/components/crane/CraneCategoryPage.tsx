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
import { craneProducts } from '@/lib/data';
import type { SortOption, CraneSubcategory } from '@/lib/types';
import ProductCard from '@/components/shared/ProductCard';

const CATEGORY_MAP: Record<string, { title: string; description: string; subcategory: CraneSubcategory }> = {
  'crane-complete': { title: 'Complete Cranes', description: 'Overhead travelling cranes, single and double girder designs from Demag, Konecranes, and other leading manufacturers. Engineered for safety and precision.', subcategory: 'complete-cranes' },
  'crane-hooks': { title: 'Crane Hooks', description: 'Laminated hooks, swivel hooks, and safety hooks with DGUV compliance. Forged from high-grade alloy steel with 5:1 safety factors.', subcategory: 'hooks' },
  'crane-wire-ropes': { title: 'Wire Ropes', description: 'Galvanized and non-rotating wire ropes for crane hoisting and suspension. EN 12385 certified with IWRC cores.', subcategory: 'wire-ropes' },
  'crane-bearings': { title: 'Bearings', description: 'Spherical roller bearings from SKF and FAG for crane slewing, hoist, and travel applications. Explorer and X-life performance classes.', subcategory: 'bearings' },
  'crane-motors': { title: 'Crane Motors', description: 'Crane duty motors from ABB and Siemens with high starting torque, S3/S4 duty ratings, and IP55 protection for demanding industrial environments.', subcategory: 'motors' },
  'crane-gearboxes': { title: 'Gearboxes', description: 'Helical-bevel gearboxes from NORD and SEW-Eurodrive with UNICASE housing, lifetime lubrication, and high overload capacity for crane drives.', subcategory: 'gearboxes' },
  'crane-brakes': { title: 'Crane Brakes', description: 'Fail-safe disc brakes and electromagnetic safety brakes with SIL 2 certification. Spring-applied, hydraulically or electromagnetically released.', subcategory: 'brakes' },
  'crane-electrical': { title: 'Electrical Components', description: 'VFDs, soft starters, and control systems from ABB and Siemens with built-in crane macros and DTC for precise motion control.', subcategory: 'electrical-components' },
  'crane-remote-controls': { title: 'Remote Controls', description: 'Industrial crane radio remote controls from HBC-radiomatic and Ikusi with proportional joysticks, FHSS technology, and IP65 protection.', subcategory: 'remote-controls' },
  'crane-accessories': { title: 'Crane Accessories', description: 'Festoon systems, cable reels, conductor bars, and other essential accessories for overhead crane power supply and cable management.', subcategory: 'accessories' },
};

const ITEMS_PER_PAGE = 9;

export default function CraneCategoryPage() {
  const { selectedCategory, navigate } = useNavigationStore();
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);

  const categoryInfo = selectedCategory && CATEGORY_MAP[selectedCategory]
    ? CATEGORY_MAP[selectedCategory]
    : { title: 'All Crane Products', description: 'Browse our complete range of crane products including complete cranes, hooks, wire ropes, bearings, motors, gearboxes, and accessories.', subcategory: null as CraneSubcategory | null };

  // Available filter options from current product set
  const baseProducts = useMemo(() => {
    if (categoryInfo.subcategory) {
      return craneProducts.filter((p) => p.subcategory === categoryInfo.subcategory);
    }
    return craneProducts;
  }, [categoryInfo.subcategory]);

  const availableBrands = useMemo(() => [...new Set(baseProducts.map((p) => p.brand))], [baseProducts]);
  const availableCapacities = useMemo(
    () => [...new Set(baseProducts.filter((p) => p.capacity).map((p) => p.capacity!))],
    [baseProducts]
  );

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let products = baseProducts;

    if (selectedBrands.length > 0) {
      products = products.filter((p) => selectedBrands.includes(p.brand));
    }
    products = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedCapacities.length > 0) {
      products = products.filter((p) => p.capacity && selectedCapacities.includes(p.capacity));
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
  }, [baseProducts, selectedBrands, priceRange, selectedCapacities, selectedAvailabilities, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }, []);

  const toggleCapacity = useCallback((cap: string) => {
    setSelectedCapacities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  }, []);

  const toggleAvailability = useCallback((avail: string) => {
    setSelectedAvailabilities((prev) =>
      prev.includes(avail) ? prev.filter((a) => a !== avail) : [...prev, avail]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setPriceRange([0, 100000]);
    setSelectedCapacities([]);
    setSelectedAvailabilities([]);
  }, []);

  const activeFilterCount =
    selectedBrands.length +
    selectedCapacities.length +
    selectedAvailabilities.length +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

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
          max={100000}
          step={500}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      {/* Capacity */}
      {availableCapacities.length > 0 && (
        <>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Capacity</h4>
            <div className="space-y-2">
              {availableCapacities.map((cap) => (
                <label key={cap} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={selectedCapacities.includes(cap)}
                    onCheckedChange={() => toggleCapacity(cap)}
                    className="border-gray-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{cap}</span>
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
              <BreadcrumbLink onClick={() => navigate('crane')} className="cursor-pointer text-gray-500 hover:text-yellow-600">
                Crane
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
                {selectedCapacities.map((c) => (
                  <Badge key={c} variant="secondary" className="gap-1 pr-1">
                    {c}
                    <button onClick={() => toggleCapacity(c)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
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
                {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    <button onClick={() => setPriceRange([0, 100000])} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
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
