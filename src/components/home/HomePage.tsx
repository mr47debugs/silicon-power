'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/shared/ProductCard';
import { useNavigationStore } from '@/lib/store';
import {
  solarProducts,
  craneProducts,
  allProducts,
  brands,
  blogPosts,
  heroSlides,
  customerReviews,
} from '@/lib/data';
import type { PageId } from '@/lib/types';
import { sendNewsletterEmail } from '@/lib/emailjs';
import {
  Sun,
  Zap,
  Battery,
  Wrench,
  Shield,
  Star,
  Heart,
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Cpu,
  Headphones,
  DollarSign,
  Settings,
  Send,
  MessageCircle,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Truck,
  Package,
  Loader2,
} from 'lucide-react';

/* ─── Section Wrapper ───────────────────────────────────────────────────── */

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionLink,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionLink?: PageId;
}) {
  const navigate = useNavigationStore((s) => s.navigate);
  return (
    <div className="flex items-end justify-between mb-6 sm:mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm sm:text-base text-gray-500">{subtitle}</p>}
      </div>
      {actionLabel && actionLink && (
        <Button
          variant="ghost"
          className="text-amber-600 hover:text-amber-700 font-semibold text-sm shrink-0"
          onClick={() => navigate(actionLink)}
        >
          {actionLabel}
          <ArrowRight className="size-4 ml-1" />
        </Button>
      )}
    </div>
  );
}

/* ─── 1. Hero Slider ────────────────────────────────────────────────────── */

function HeroSlider() {
  const navigate = useNavigationStore((s) => s.navigate);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="relative w-full">
      <Carousel
        plugins={[plugin.current]}
        opts={{ loop: true, align: 'start' }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div
                className={`relative w-full min-h-[320px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[560px] bg-gradient-to-r ${slide.bgColor} overflow-hidden`}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-amber-400 blur-3xl" />
                  <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-yellow-300 blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col items-start justify-center h-full min-h-[320px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[560px] px-6 sm:px-12 md:px-20 lg:px-24 max-w-4xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
                    onClick={() => navigate(slide.ctaLink as PageId)}
                  >
                    {slide.cta}
                    <ArrowRight className="size-5 ml-2" />
                  </Button>
                </div>

                {/* Side image decoration */}
                <div className="hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2">
                  <div className="relative w-72 xl:w-80 h-72 xl:h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex left-2 sm:left-4 bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/40 size-10 sm:size-12" />
        <CarouselNext className="hidden sm:flex right-2 sm:right-4 bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/40 size-10 sm:size-12" />
      </Carousel>
    </div>
  );
}

/* ─── 2. Featured Categories ────────────────────────────────────────────── */

const categories = [
  { id: 'solar-panels' as PageId, name: 'Solar Panels', icon: Sun, color: 'from-amber-400 to-orange-500', count: '4 Products' },
  { id: 'solar-inverters' as PageId, name: 'Inverters', icon: Zap, color: 'from-blue-400 to-cyan-500', count: '3 Products' },
  { id: 'solar-batteries' as PageId, name: 'Batteries', icon: Battery, color: 'from-emerald-400 to-teal-500', count: '3 Products' },
  { id: 'solar-complete-systems' as PageId, name: 'Solar Systems', icon: Package, color: 'from-purple-400 to-violet-500', count: '3 Kits' },
  { id: 'crane-complete' as PageId, name: 'Cranes', icon: Wrench, color: 'from-red-400 to-rose-500', count: '2 Cranes' },
  { id: 'crane-motors' as PageId, name: 'Crane Motors', icon: Settings, color: 'from-slate-400 to-gray-500', count: '2 Motors' },
  { id: 'crane-hooks' as PageId, name: 'Crane Hooks', icon: Shield, color: 'from-yellow-400 to-amber-500', count: '2 Hooks' },
  { id: 'crane-accessories' as PageId, name: 'Crane Parts', icon: Wrench, color: 'from-indigo-400 to-blue-500', count: 'All Parts' },
];

function FeaturedCategories() {
  const navigate = useNavigationStore((s) => s.navigate);
  return (
    <Section className="py-10 sm:py-16">
      <SectionHeader title="Shop by Category" subtitle="Browse our complete range of solar and crane solutions" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => navigate(cat.id)}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-4 sm:p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-amber-300"
            >
              <div
                className={`inline-flex items-center justify-center size-10 sm:size-12 rounded-lg bg-gradient-to-br ${cat.color} mb-3 transition-transform group-hover:scale-110`}
              >
                <Icon className="size-5 sm:size-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-0.5">{cat.name}</h3>
              <p className="text-xs text-gray-400">{cat.count}</p>
              <div className="absolute bottom-0 right-0 size-16 bg-gradient-to-tl from-amber-100/60 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── Horizontal Scroll Row ─────────────────────────────────────────────── */

function ProductScrollRow({ products }: { products: typeof allProducts }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative group/scroll">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[260px] sm:min-w-[280px] snap-start shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {/* Nav buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 size-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center z-10 hidden sm:flex hover:bg-gray-50 transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft className="size-5 text-gray-600" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 size-10 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center z-10 hidden sm:flex hover:bg-gray-50 transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight className="size-5 text-gray-600" />
      </button>
    </div>
  );
}

/* ─── 3. Top Solar Products ─────────────────────────────────────────────── */

function TopSolarProducts() {
  const topSolar = solarProducts.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 6);
  return (
    <Section className="py-10 sm:py-16">
      <SectionHeader
        title="Top Solar Products"
        subtitle="Featured and bestselling solar equipment"
        actionLabel="View All Solar"
        actionLink="solar"
      />
      <ProductScrollRow products={topSolar} />
    </Section>
  );
}

/* ─── 4. Top Crane Products ─────────────────────────────────────────────── */

function TopCraneProducts() {
  const topCrane = craneProducts.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 6);
  return (
    <Section className="py-10 sm:py-16 bg-gray-50">
      <SectionHeader
        title="Top Crane Products"
        subtitle="Featured and bestselling crane equipment & parts"
        actionLabel="View All Crane"
        actionLink="crane"
      />
      <ProductScrollRow products={topCrane} />
    </Section>
  );
}

/* ─── 5. Complete Solar Systems Banner ───────────────────────────────────── */

function CompleteSolarSystems() {
  const navigate = useNavigationStore((s) => s.navigate);
  const systems = solarProducts.filter((p) => p.subcategory === 'complete-systems');
  return (
    <Section className="py-10 sm:py-16">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a1a2e] to-[#0a3d62] p-6 sm:p-10 md:p-14">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <div className="flex-1 text-center lg:text-left">
            <Badge className="bg-amber-500 text-black border-0 font-bold mb-3">COMPLETE KITS</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
              Complete Solar Systems
            </h2>
            <p className="text-gray-300 mb-6 max-w-lg text-sm sm:text-base">
              Pre-engineered solar kits from 5kW to 20kW with everything included.
              Panels, inverter, mounting, cables — ready to install. Starting from
              <span className="text-amber-400 font-bold"> $5,800</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25"
                onClick={() => navigate('solar-complete-systems')}
              >
                View Solar Kits
                <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('solar-builder')}
              >
                Configure Yours
              </Button>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
            {systems.slice(0, 3).map((sys) => (
              <div
                key={sys.id}
                className="min-w-[160px] sm:min-w-[180px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => navigate('product', sys.id)}
              >
                <p className="text-amber-400 font-bold text-lg">{sys.power}</p>
                <p className="text-white text-xs mt-1 line-clamp-2">{sys.name}</p>
                <p className="text-amber-300 font-semibold text-sm mt-2">
                  ${sys.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── 6. Complete Crane Solutions Banner ──────────────────────────────────── */

function CompleteCraneSolutions() {
  const navigate = useNavigationStore((s) => s.navigate);
  const cranes = craneProducts.filter((p) => p.subcategory === 'complete-cranes');
  return (
    <Section className="py-10 sm:py-16 bg-gray-50">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a1a2e] to-[#2c3e50] p-6 sm:p-10 md:p-14">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <div className="flex-1 text-center lg:text-left">
            <Badge className="bg-red-500 text-white border-0 font-bold mb-3">INDUSTRIAL</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
              Complete Crane Solutions
            </h2>
            <p className="text-gray-300 mb-6 max-w-lg text-sm sm:text-base">
              From single girder overhead cranes to custom double girder systems.
              Precision-engineered with smart monitoring and safety features.
              Starting from <span className="text-amber-400 font-bold">$45,000</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25"
                onClick={() => navigate('crane-complete')}
              >
                View Cranes
                <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('crane-configurator')}
              >
                Configure Yours
              </Button>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
            {cranes.slice(0, 2).map((crane) => (
              <div
                key={crane.id}
                className="min-w-[180px] sm:min-w-[200px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => navigate('product', crane.id)}
              >
                <p className="text-amber-400 font-bold text-lg">{crane.capacity}</p>
                <p className="text-white text-xs mt-1 line-clamp-2">{crane.name}</p>
                <p className="text-amber-300 font-semibold text-sm mt-2">
                  {crane.estimatedPrice || `$${crane.price.toLocaleString()}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── 7. Top Brands ─────────────────────────────────────────────────────── */

function TopBrands() {
  const navigate = useNavigationStore((s) => s.navigate);
  return (
    <Section className="py-10 sm:py-16">
      <SectionHeader
        title="Top Brands"
        subtitle="World-leading manufacturers we trust"
        actionLabel="View All Brands"
        actionLink="brands"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => navigate('brands')}
            className="group flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 transition-all hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5"
          >
            <div className="relative w-full h-12 sm:h-14">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm text-gray-900">{brand.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{brand.country} &bull; {brand.productCount} products</p>
            </div>
          </button>
        ))}
      </div>
    </Section>
  );
}

/* ─── 8. Popular Products ────────────────────────────────────────────────── */

function PopularProducts() {
  const popular = [...allProducts]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8);
  return (
    <Section className="py-10 sm:py-16 bg-gray-50">
      <SectionHeader
        title="Popular Products"
        subtitle="Most reviewed products across both categories"
        actionLabel="View All"
        actionLink="solar"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {popular.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Section>
  );
}

/* ─── 9. Best Sellers ────────────────────────────────────────────────────── */

function BestSellers() {
  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 8);
  return (
    <Section className="py-10 sm:py-16">
      <SectionHeader
        title="Best Sellers"
        subtitle="Our customers' top choices"
        actionLabel="View All"
        actionLink="solar"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Section>
  );
}

/* ─── 10. AI Recommendation CTA ──────────────────────────────────────────── */

function AIRecommendation() {
  const navigate = useNavigationStore((s) => s.navigate);
  return (
    <Section className="py-10 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <SectionHeader title="Smart Tools" subtitle="AI-powered tools to find the perfect solution" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Solar AI */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-6 sm:p-8 cursor-pointer transition-all hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          onClick={() => navigate('solar-ai')}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <Sparkles className="size-4 text-white" />
              <span className="text-white text-xs font-semibold">AI-POWERED</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Solar Recommendation
            </h3>
            <p className="text-white/80 text-sm sm:text-base mb-6 max-w-sm">
              Tell us your energy needs and budget. Our AI will design the perfect solar system for you in seconds.
            </p>
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-100 font-bold shadow-lg"
            >
              Get AI Recommendation
              <Sparkles className="size-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Crane Configurator */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 sm:p-8 cursor-pointer transition-all hover:shadow-2xl hover:shadow-gray-900/20 hover:-translate-y-1"
          onClick={() => navigate('crane-configurator')}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <Cpu className="size-4 text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold">CONFIGURATOR</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Crane Configurator
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-sm">
              Configure your custom crane by specifying capacity, span, height, and components. Get instant pricing.
            </p>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25"
            >
              Configure Your Crane
              <Settings className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── 11. Why Choose Us ─────────────────────────────────────────────────── */

const whyChooseUs = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Only genuine products from world-leading manufacturers with full warranty coverage.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Our engineers provide free system design, technical consultation, and after-sales support.',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: DollarSign,
    title: 'Competitive Pricing',
    description: 'Direct partnerships with manufacturers ensure the best prices with no middleman markup.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Settings,
    title: 'Custom Solutions',
    description: 'Need something unique? Our team designs custom solar and crane solutions for any requirement.',
    color: 'from-purple-400 to-violet-500',
  },
];

function WhyChooseUs() {
  return (
    <Section className="py-10 sm:py-16 bg-gray-50">
      <SectionHeader title="Why Choose Us" subtitle="Trusted by 10,000+ businesses worldwide" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {whyChooseUs.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-gray-200 bg-white text-center p-6 hover:shadow-lg transition-shadow hover:border-amber-300">
              <CardContent className="p-0 space-y-3">
                <div
                  className={`inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br ${item.color} mx-auto shadow-lg`}
                >
                  <Icon className="size-7 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── 12. Customer Reviews ──────────────────────────────────────────────── */

function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const approvedReviews = customerReviews.filter((r) => r.approved);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % approvedReviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [approvedReviews.length]);

  return (
    <Section className="py-10 sm:py-16">
      <SectionHeader title="Customer Reviews" subtitle="What our customers say about us" />
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {approvedReviews.map((review, idx) => (
            <div
              key={review.id}
              className="min-w-[280px] sm:min-w-[320px] snap-start shrink-0"
            >
              <Card className="h-full border-gray-200 bg-white hover:shadow-md transition-shadow p-5">
                <CardContent className="p-0 space-y-3">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${star <= review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                          }`}
                      />
                    ))}
                  </div>
                  {/* Comment */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  {/* User */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <div className="size-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.userName}</p>
                      <p className="text-[10px] text-gray-400">{review.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {approvedReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`size-2 rounded-full transition-all ${idx === currentIndex ? 'bg-amber-500 w-6' : 'bg-gray-300'
                }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 13. Blog Articles ─────────────────────────────────────────────────── */

function BlogArticles() {
  const navigate = useNavigationStore((s) => s.navigate);
  const latestPosts = blogPosts.slice(0, 3);
  return (
    <Section className="py-10 sm:py-16 bg-gray-50">
      <SectionHeader
        title="From Our Blog"
        subtitle="Expert insights, guides, and industry news"
        actionLabel="View All Posts"
        actionLink="blog"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {latestPosts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden border-gray-200 bg-white cursor-pointer group hover:shadow-lg transition-all hover:-translate-y-1 py-0 gap-0"
            onClick={() => navigate('blog')}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <Badge className="absolute top-3 left-3 bg-amber-500 text-black border-0 text-[10px] font-bold">
                {post.category.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
            <CardContent className="p-4 sm:p-5 space-y-2">
              <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <BookOpen className="size-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {post.readTime}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ─── 14. Custom Solution CTA ───────────────────────────────────────────── */

function CustomSolutionCTA() {
  const navigate = useNavigationStore((s) => s.navigate);
  return (
    <Section className="py-10 sm:py-16">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 p-8 sm:p-12 md:p-16 text-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-amber-400" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-amber-400" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
            Can&apos;t find what you need?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Our engineering team can design custom solar systems and crane solutions
            tailored to your exact requirements. Get a free consultation and quote.
          </p>
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
            onClick={() => navigate('custom-solutions')}
          >
            Request Custom Solution
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* ─── 15. Newsletter ─────────────────────────────────────────────────────── */

function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribing(true);
    const result = await sendNewsletterEmail(email);
    setIsSubscribing(false);
    if (result.success) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } else {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <Section className="py-10 sm:py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-4 shadow-lg">
          <Send className="size-7 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Stay Updated</h2>
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          Subscribe to our newsletter for the latest products, industry insights, and exclusive deals.
        </p>
        {subscribed ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-center gap-2">
            <Shield className="size-5 text-emerald-600" />
            <p className="text-emerald-700 font-semibold">Thank you for subscribing!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-11 rounded-lg border-gray-300 bg-white"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isSubscribing}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-11 rounded-lg shadow-md disabled:opacity-50"
            >
              {isSubscribing ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="size-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}
        <p className="text-xs text-gray-400 mt-3">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </Section>
  );
}

/* ─── Main HomePage Component ────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Featured Categories */}
      <FeaturedCategories />

      {/* 3. Top Solar Products */}
      <TopSolarProducts />

      {/* 4. Top Crane Products */}
      <TopCraneProducts />

      {/* 5. Complete Solar Systems */}
      <CompleteSolarSystems />

      {/* 6. Complete Crane Solutions */}
      <CompleteCraneSolutions />

      {/* 7. Top Brands */}
      <TopBrands />

      {/* 8. Popular Products */}
      <PopularProducts />

      {/* 9. Best Sellers */}
      <BestSellers />

      {/* 10. AI Recommendation CTA */}
      <AIRecommendation />

      {/* 11. Why Choose Us */}
      <WhyChooseUs />

      {/* 12. Customer Reviews */}
      <CustomerReviews />

      {/* 13. Blog Articles */}
      <BlogArticles />

      {/* 14. Custom Solution CTA */}
      <CustomSolutionCTA />

      {/* 15. Newsletter */}
      <Newsletter />
    </div>
  );
}
