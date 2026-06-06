'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigationStore, useCartStore } from '@/lib/store';
import { craneProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import {
  Search,
  Home,
  Upload,
  MessageCircle,
  ShoppingCart,
  Wrench,
  Cog,
  Anchor,
  Cable,
  CircleDot,
  Disc,
  ShieldAlert,
  CircuitBoard,
  Radio,
  Settings,
  HelpCircle,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Phone,
  FileText,
  Zap,
} from 'lucide-react';

// ─── Constants ──────────────────────────────────────────────────────────────

const EQUIPMENT_TYPES = [
  'Overhead Crane',
  'Gantry Crane',
  'Jib Crane',
  'Hoist',
];

const BRANDS = ['Demag', 'Konecranes', 'ABB', 'Siemens', 'Other'];

const PART_CATEGORIES = [
  { value: 'Hook', label: 'Hook', icon: <Anchor className="size-4" /> },
  { value: 'Wire Rope', label: 'Wire Rope', icon: <Cable className="size-4" /> },
  { value: 'Bearing', label: 'Bearing', icon: <CircleDot className="size-4" /> },
  { value: 'Motor', label: 'Motor', icon: <Cog className="size-4" /> },
  { value: 'Gearbox', label: 'Gearbox', icon: <Disc className="size-4" /> },
  { value: 'Brake', label: 'Brake', icon: <ShieldAlert className="size-4" /> },
  { value: 'Electrical', label: 'Electrical', icon: <CircuitBoard className="size-4" /> },
  { value: 'Remote', label: 'Remote', icon: <Radio className="size-4" /> },
  { value: 'Other', label: 'Other', icon: <Settings className="size-4" /> },
];

const SUBCATEGORY_MAP: Record<string, string> = {
  Hook: 'hooks',
  'Wire Rope': 'wire-ropes',
  Bearing: 'bearings',
  Motor: 'motors',
  Gearbox: 'gearboxes',
  Brake: 'brakes',
  Electrical: 'electrical-components',
  Remote: 'remote-controls',
  Other: 'accessories',
};

const availabilityConfig: Record<string, { label: string; color: string; textColor: string }> = {
  'in-stock': { label: 'In Stock', color: 'bg-emerald-500', textColor: 'text-emerald-50' },
  limited: { label: 'Limited', color: 'bg-amber-500', textColor: 'text-amber-50' },
  'pre-order': { label: 'Pre-Order', color: 'bg-blue-500', textColor: 'text-blue-50' },
  'out-of-stock': { label: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-50' },
};

// ─── Spare Part Card ────────────────────────────────────────────────────────

function SparePartCard({ product }: { product: Product }) {
  const navigate = useNavigationStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);
  const avail = availabilityConfig[product.availability];

  const handleGetQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hi, I'd like a quote for: ${product.name} (ID: ${product.id})\nPrice: $${product.price.toLocaleString()}`
    );
    window.open(`https://wa.me/923001234567?text=${msg}`, '_blank');
  };

  return (
    <Card className="group border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-yellow-300 cursor-pointer py-0 gap-0">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 shrink-0">
              <Wrench className="size-5" />
            </div>
            <div className="min-w-0">
              <h4
                className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-yellow-600 transition-colors"
                onClick={() => navigate('product', product.id)}
              >
                {product.name}
              </h4>
              <p className="text-xs text-gray-500">{product.brand}</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${avail.color} ${avail.textColor}`}
          >
            {avail.label}
          </span>
        </div>

        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {Object.entries(product.specifications)
            .slice(0, 3)
            .map(([key, val]) => (
              <Badge
                key={key}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 bg-gray-100 text-gray-600"
              >
                {key}: {val}
              </Badge>
            ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-green-300 text-green-600 hover:bg-green-50"
              onClick={handleGetQuote}
            >
              <MessageCircle className="size-3 mr-1" />
              Quote
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                addItem(product, 1);
              }}
              disabled={product.availability === 'out-of-stock'}
            >
              <ShoppingCart className="size-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface FormData {
  equipmentType: string;
  brand: string;
  model: string;
  year: string;
  requiredPart: string;
  description: string;
}

export default function SparePartFinderPage() {
  const navigate = useNavigationStore((s) => s.navigate);

  const [form, setForm] = useState<FormData>({
    equipmentType: '',
    brand: '',
    model: '',
    year: '',
    requiredPart: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const updateForm = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    form.equipmentType && form.brand && form.requiredPart;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitted(true);
    setSearching(true);
    setResults([]);

    // Simulate search delay
    setTimeout(() => {
      const subcategory = SUBCATEGORY_MAP[form.requiredPart] || 'accessories';
      const filtered = craneProducts.filter(
        (p) => p.subcategory === subcategory
      );
      setResults(filtered);
      setSearching(false);
    }, 1500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSearching(false);
    setResults([]);
    setForm({
      equipmentType: '',
      brand: '',
      model: '',
      year: '',
      requiredPart: '',
      description: '',
    });
  };

  const generateWhatsAppMessage = () => {
    const msg = encodeURIComponent(
      `Hi, I need a spare part for my crane:\n\n` +
      `• Equipment Type: ${form.equipmentType}\n` +
      `• Brand: ${form.brand}\n` +
      `• Model: ${form.model || 'N/A'}\n` +
      `• Year: ${form.year || 'N/A'}\n` +
      `• Required Part: ${form.requiredPart}\n` +
      (form.description ? `• Details: ${form.description}\n` : '') +
      `\nPlease help me find the right part.`
    );
    return `https://wa.me/923001234567?text=${msg}`;
  };

  const partCategoryIcon = useMemo(() => {
    const found = PART_CATEGORIES.find((c) => c.value === form.requiredPart);
    return found?.icon || <Search className="size-5" />;
  }, [form.requiredPart]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate('home')}
                className="cursor-pointer text-gray-500 hover:text-yellow-600"
              >
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate('crane')}
                className="cursor-pointer text-gray-500 hover:text-yellow-600"
              >
                Crane
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-sm font-medium text-gray-900">
                Spare Part Finder
              </span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-400 shadow-lg">
              <Search className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Spare Part Finder
              </h1>
              <p className="text-sm text-gray-500">
                Find the right spare parts for your crane equipment
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!submitted ? (
          /* ─── Form ──────────────────────────────────────────────────────── */
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Equipment Info Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                      <Cog className="size-4" />
                    </div>
                    Equipment Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Equipment Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Equipment Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={form.equipmentType}
                        onValueChange={(val) => updateForm('equipmentType', val)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select equipment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {EQUIPMENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Brand <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={form.brand}
                        onValueChange={(val) => updateForm('brand', val)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRANDS.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Model
                      </Label>
                      <Input
                        placeholder="e.g., EKKE 10t, CXT 16t"
                        value={form.model}
                        onChange={(e) => updateForm('model', e.target.value)}
                        className="h-11"
                      />
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Year
                      </Label>
                      <Input
                        type="number"
                        min={1990}
                        max={2026}
                        placeholder="e.g., 2020"
                        value={form.year}
                        onChange={(e) => updateForm('year', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Part Requirements Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                      <Wrench className="size-4" />
                    </div>
                    Part Requirements
                  </h3>
                  <div className="space-y-4">
                    {/* Required Part Category */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Required Part Category <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {PART_CATEGORIES.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => updateForm('requiredPart', cat.value)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                              form.requiredPart === cat.value
                                ? 'border-yellow-500 bg-yellow-50 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-50/50'
                            }`}
                          >
                            <div
                              className={`flex size-8 items-center justify-center rounded-lg ${
                                form.requiredPart === cat.value
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {cat.icon}
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                form.requiredPart === cat.value
                                  ? 'text-yellow-700'
                                  : 'text-gray-600'
                              }`}
                            >
                              {cat.label}
                            </span>
                            {form.requiredPart === cat.value && (
                              <CheckCircle2 className="size-3.5 text-yellow-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Additional Details
                      </Label>
                      <Textarea
                        placeholder="Describe the part you need, including specifications, dimensions, or any reference numbers..."
                        value={form.description}
                        onChange={(e) => updateForm('description', e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    {/* Upload Reference */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Upload Reference
                      </Label>
                      <button
                        type="button"
                        className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-yellow-400 hover:bg-yellow-50/50 transition-colors"
                        onClick={() => {
                          // UI only - no actual upload
                        }}
                      >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                          <Upload className="size-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">
                            Upload photo or drawing of the part
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, PDF up to 10MB — helps us identify the exact part
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isFormValid}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex-1 h-12 text-sm gap-2"
                  >
                    <Search className="size-5" />
                    Find Spare Parts
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-12 text-sm gap-2 border-green-300 text-green-600 hover:bg-green-50"
                    asChild
                    disabled={!form.equipmentType && !form.brand}
                  >
                    <a
                      href={generateWhatsAppMessage()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-5" />
                      Ask on WhatsApp
                    </a>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* ─── Results ──────────────────────────────────────────────────── */
          <div className="space-y-6">
            {/* Searching State */}
            {searching && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="relative inline-flex">
                    <Loader2 className="size-12 text-yellow-500 animate-spin" />
                    <Search className="size-5 text-yellow-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Searching for spare parts...
                    </h3>
                    <p className="text-sm text-gray-500">
                      Finding compatible parts for your {form.equipmentType} ({form.brand})
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="size-2 rounded-full bg-yellow-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Summary */}
            {!searching && (
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500 text-white">
                        {partCategoryIcon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {form.requiredPart} for {form.brand} {form.equipmentType}
                        </p>
                        <p className="text-xs text-gray-500">
                          {form.model && `Model: ${form.model} • `}
                          {form.year && `Year: ${form.year} • `}
                          {results.length} part{results.length !== 1 ? 's' : ''} found
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="gap-1.5"
                    >
                      <Search className="size-3.5" />
                      New Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {!searching && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((product) => (
                  <SparePartCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!searching && results.length === 0 && submitted && (
              <Card className="border-gray-200">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gray-100 mx-auto">
                    <XCircle className="size-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      No matching parts found
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      We couldn&apos;t find parts matching your exact criteria. Our team can help
                      you find the right part — contact us via WhatsApp for assistance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Can't Find Part CTA */}
            {!searching && submitted && (
              <Card className="border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-xl bg-yellow-500 text-white shrink-0">
                      <HelpCircle className="size-7" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Can&apos;t find your part?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Our engineers can identify and source any crane spare part. Send us your
                        equipment details and we&apos;ll find it for you.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2"
                        asChild
                      >
                        <a
                          href={generateWhatsAppMessage()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="size-5" />
                          WhatsApp Us
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs"
                        asChild
                      >
                        <a href="tel:+923001234567">
                          <Phone className="size-3.5" />
                          +92 300 123 4567
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            {!searching && submitted && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => navigate('crane-configurator')}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-yellow-300 transition-all text-left"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gray-900 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                    <Wrench className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Configure a New Crane
                    </p>
                    <p className="text-xs text-gray-500">
                      Build from scratch
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-gray-300 ml-auto group-hover:text-yellow-500 transition-colors" />
                </button>

                <button
                  onClick={() => navigate('crane')}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-yellow-300 transition-all text-left"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gray-900 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                    <Package className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Browse All Crane Parts
                    </p>
                    <p className="text-xs text-gray-500">
                      Full catalog
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-gray-300 ml-auto group-hover:text-yellow-500 transition-colors" />
                </button>

                <button
                  onClick={() => navigate('custom-solutions')}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-yellow-300 transition-all text-left"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gray-900 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Custom Engineering
                    </p>
                    <p className="text-xs text-gray-500">
                      Bespoke solutions
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-gray-300 ml-auto group-hover:text-yellow-500 transition-colors" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
