'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  Phone,
  Mail,
  Truck,
  ChevronDown,
  Sun,
  Construction,
  Zap,
  Battery,
  Frame,
  Gauge,
  Wrench,
  LayoutGrid,
  Calculator,
  Bot,
  Anchor,
  Cable,
  CircleDot,
  Cog,
  Disc,
  CircuitBoard,
  Radio,
  Settings,
  GitCompareArrows,
  Lightbulb,
  Building2,
  BookOpen,
  Info,
  MessageSquare,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNavigationStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import { useWishlistStore } from '@/lib/store';
import { useCompareStore } from '@/lib/store';
import { useSearchStore } from '@/lib/store';
import { useMobileMenuStore } from '@/lib/store';
import type { PageId } from '@/lib/types';

// ─── Data ────────────────────────────────────────────────────────────────────

interface MegaMenuItem {
  label: string;
  pageId: PageId;
  icon: React.ReactNode;
  description?: string;
}

interface MegaMenuGroup {
  title: string;
  items: MegaMenuItem[];
}

const solarMenuGroups: MegaMenuGroup[] = [
  {
    title: 'Products',
    items: [
      { label: 'Solar Panels', pageId: 'solar-panels', icon: <Sun className="size-4" />, description: 'Monocrystalline & Polycrystalline' },
      { label: 'Inverters', pageId: 'solar-inverters', icon: <Zap className="size-4" />, description: 'String & Micro Inverters' },
      { label: 'Batteries', pageId: 'solar-batteries', icon: <Battery className="size-4" />, description: 'Lithium & Lead-Acid Storage' },
      { label: 'Structures', pageId: 'solar-structures', icon: <Frame className="size-4" />, description: 'Mounting & Racking Systems' },
      { label: 'Charge Controllers', pageId: 'solar-charge-controllers', icon: <Gauge className="size-4" />, description: 'MPPT & PWM Controllers' },
      { label: 'Accessories', pageId: 'solar-accessories', icon: <Wrench className="size-4" />, description: 'Cables, Connectors & More' },
      { label: 'Complete Systems', pageId: 'solar-complete-systems', icon: <LayoutGrid className="size-4" />, description: 'All-in-One Solar Kits' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Solar Builder', pageId: 'solar-builder', icon: <Construction className="size-4" />, description: 'Design Your System' },
      { label: 'Solar Calculator', pageId: 'solar-calculator', icon: <Calculator className="size-4" />, description: 'Estimate Savings & ROI' },
      { label: 'AI Recommendation', pageId: 'solar-ai', icon: <Bot className="size-4" />, description: 'Smart Product Matching' },
    ],
  },
];

const craneMenuGroups: MegaMenuGroup[] = [
  {
    title: 'Products',
    items: [
      { label: 'Complete Cranes', pageId: 'crane-complete', icon: <Anchor className="size-4" />, description: 'Overhead, Gantry & Jib Cranes' },
      { label: 'Hooks', pageId: 'crane-hooks', icon: <Cable className="size-4" />, description: 'Lifting Hooks & Attachments' },
      { label: 'Wire Ropes', pageId: 'crane-wire-ropes', icon: <Cable className="size-4" />, description: 'Steel Wire Ropes & Slings' },
      { label: 'Bearings', pageId: 'crane-bearings', icon: <CircleDot className="size-4" />, description: 'Ball & Roller Bearings' },
      { label: 'Motors', pageId: 'crane-motors', icon: <Cog className="size-4" />, description: 'Crane Duty Motors' },
      { label: 'Gearboxes', pageId: 'crane-gearboxes', icon: <Disc className="size-4" />, description: 'Helical & Worm Gearboxes' },
      { label: 'Brakes', pageId: 'crane-brakes', icon: <Disc className="size-4" />, description: 'Disc & Drum Brakes' },
      { label: 'Electrical', pageId: 'crane-electrical', icon: <CircuitBoard className="size-4" />, description: 'Panels, VFDs & Components' },
      { label: 'Remote Controls', pageId: 'crane-remote-controls', icon: <Radio className="size-4" />, description: 'Wireless & Pendant Controls' },
      { label: 'Accessories', pageId: 'crane-accessories', icon: <Settings className="size-4" />, description: 'Limit Switches & Safety' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Crane Configurator', pageId: 'crane-configurator', icon: <Construction className="size-4" />, description: 'Build Your Custom Crane' },
      { label: 'Spare Part Finder', pageId: 'spare-part-finder', icon: <Search className="size-4" />, description: 'Find Compatible Parts' },
    ],
  },
];

// ─── Header Component ────────────────────────────────────────────────────────

export default function Header() {
  const navigate = useNavigationStore((s) => s.navigate);
  const currentPage = useNavigationStore((s) => s.currentPage);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistItems = useWishlistStore((s) => s.items);
  const compareItems = useCompareStore((s) => s.items);
  const { openSearch } = useSearchStore();
  const { isOpen: mobileMenuOpen, close: closeMobileMenu } = useMobileMenuStore();
  const openMobileMenu = useMobileMenuStore((s) => s.open);

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback(
    (pageId: PageId) => {
      navigate(pageId);
      setActiveDropdown(null);
      closeMobileMenu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate, closeMobileMenu]
  );

  const isActive = useCallback(
    (pageId: PageId | PageId[]) => {
      const pages = Array.isArray(pageId) ? pageId : [pageId];
      return pages.includes(currentPage);
    },
    [currentPage]
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs">
          <div className="hidden items-center gap-4 sm:flex">
            <a
              href="tel:+923001234567"
              className="flex items-center gap-1 transition-colors hover:text-amber-400"
            >
              <Phone className="size-3" />
              <span>+92 300 123 4567</span>
            </a>
            <Separator orientation="vertical" className="h-3 bg-primary-foreground/20" />
            <a
              href="mailto:info@Silicon Power.com"
              className="flex items-center gap-1 transition-colors hover:text-amber-400"
            >
              <Mail className="size-3" />
              <span>info@Silicon Power.com</span>
            </a>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Truck className="size-3" />
            <span className="font-medium">Free Shipping on Orders Over PKR 50,000</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button className="transition-colors hover:text-amber-400">EN</button>
            <Separator orientation="vertical" className="h-3 bg-primary-foreground/20" />
            <button className="transition-colors hover:text-amber-400">UR</button>
          </div>
        </div>
      </div>

      {/* ─── Main Header ──────────────────────────────────────────────────── */}
      <div className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500">
              <Sun className="size-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-primary">
                Silicon Power
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600">
                Pro
              </span>
            </div>
          </button>

          {/* Search Bar (Desktop) */}
          <div
            onClick={openSearch}
            className="hidden flex-1 cursor-pointer md:flex"
          >
            <div className="flex h-10 w-full max-w-lg items-center gap-2 rounded-lg border border-amber-300 bg-amber-50/50 px-4 transition-all hover:border-amber-500 hover:bg-amber-50">
              <Search className="size-4 text-amber-600" />
              <span className="text-sm text-muted-foreground">
                Search solar panels, crane parts, brands...
              </span>
              <kbd className="ml-auto hidden rounded border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">
                Ctrl+K
              </kbd>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={openSearch}
              aria-label="Search"
            >
              <Search className="size-5" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => handleNavigate('wishlist')}
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-amber-500 p-0 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => handleNavigate('cart')}
              aria-label="Cart"
            >
              <ShoppingCart className="size-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-amber-500 p-0 text-[10px] font-bold text-white">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* WhatsApp */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-green-600 hover:text-green-700 sm:inline-flex"
              asChild
            >
              <a
                href="https://wa.me/923001234567?text=Hi%2C%20I%27m%20interested%20in%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              >
                <MessageSquare className="size-5" />
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={openMobileMenu}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Navigation Bar (Desktop) ─────────────────────────────────────── */}
      <nav className="hidden border-b bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4">
          <NavigationMenu className="h-10 w-full justify-center">
            <NavigationMenuList className="gap-0">
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('home')
                      ? 'text-amber-600'
                      : 'text-foreground hover:text-amber-600'
                  }`}
                  onClick={() => handleNavigate('home')}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Solar Mega Menu */}
              <NavigationMenuItem
                onMouseEnter={() => setActiveDropdown('solar')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavigationMenuTrigger
                  className={`h-10 rounded-none border-b-2 px-3 text-sm font-medium transition-colors data-[state=open]:bg-amber-50 data-[state=open]:text-amber-600 ${
                    isActive([
                      'solar',
                      'solar-panels',
                      'solar-inverters',
                      'solar-batteries',
                      'solar-structures',
                      'solar-charge-controllers',
                      'solar-accessories',
                      'solar-complete-systems',
                      'solar-builder',
                      'solar-calculator',
                      'solar-ai',
                    ])
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-foreground hover:border-amber-500 hover:text-amber-600'
                  }`}
                >
                  Solar
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[600px] gap-0 p-4">
                    {solarMenuGroups.map((group, groupIdx) => (
                      <div
                        key={group.title}
                        className={`flex-1 ${groupIdx > 0 ? 'border-l pl-4' : ''}`}
                      >
                        <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                          {group.title}
                        </h3>
                        <ul className="space-y-0.5">
                          {group.items.map((item) => (
                            <li key={item.pageId}>
                              <NavigationMenuLink
                                asChild
                              >
                                <button
                                  onClick={() => handleNavigate(item.pageId)}
                                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-amber-50 hover:text-amber-700"
                                >
                                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                                    {item.icon}
                                  </span>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {item.label}
                                    </div>
                                    {item.description && (
                                      <div className="text-xs text-muted-foreground">
                                        {item.description}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Crane Mega Menu */}
              <NavigationMenuItem
                onMouseEnter={() => setActiveDropdown('crane')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavigationMenuTrigger
                  className={`h-10 rounded-none border-b-2 px-3 text-sm font-medium transition-colors data-[state=open]:bg-amber-50 data-[state=open]:text-amber-600 ${
                    isActive([
                      'crane',
                      'crane-complete',
                      'crane-hooks',
                      'crane-wire-ropes',
                      'crane-bearings',
                      'crane-motors',
                      'crane-gearboxes',
                      'crane-brakes',
                      'crane-electrical',
                      'crane-remote-controls',
                      'crane-accessories',
                      'crane-configurator',
                      'spare-part-finder',
                    ])
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-foreground hover:border-amber-500 hover:text-amber-600'
                  }`}
                >
                  Crane
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[600px] gap-0 p-4">
                    {craneMenuGroups.map((group, groupIdx) => (
                      <div
                        key={group.title}
                        className={`flex-1 ${groupIdx > 0 ? 'border-l pl-4' : ''}`}
                      >
                        <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                          {group.title}
                        </h3>
                        <ul className="space-y-0.5">
                          {group.items.map((item) => (
                            <li key={item.pageId}>
                              <NavigationMenuLink asChild>
                                <button
                                  onClick={() => handleNavigate(item.pageId)}
                                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-amber-50 hover:text-amber-700"
                                >
                                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                                    {item.icon}
                                  </span>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {item.label}
                                    </div>
                                    {item.description && (
                                      <div className="text-xs text-muted-foreground">
                                        {item.description}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Brands */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('brands')
                      ? 'text-amber-600'
                      : 'text-foreground hover:text-amber-600'
                  }`}
                  onClick={() => handleNavigate('brands')}
                >
                  Brands
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Compare */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('compare')
                      ? 'text-amber-600'
                      : 'text-foreground hover:text-amber-600'
                  }`}
                  onClick={() => handleNavigate('compare')}
                >
                  Compare
                  {compareItems.length > 0 && (
                    <Badge className="ml-1 bg-amber-500 px-1.5 py-0 text-[10px] font-bold text-white">
                      {compareItems.length}
                    </Badge>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Custom Solutions */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('custom-solutions')
                      ? 'text-amber-600'
                      : 'text-foreground hover:text-amber-600'
                  }`}
                  onClick={() => handleNavigate('custom-solutions')}
                >
                  Custom Solutions
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Blog */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('blog')
                      ? 'text-amber-600'
                      : 'text-foreground hover:text-amber-600'
                  }`}
                  onClick={() => handleNavigate('blog')}
                >
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* About */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('about')
                      ? 'text-amber-600'
                      : 'text-foreground hover:text-amber-600'
                  }`}
                  onClick={() => handleNavigate('about')}
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Contact */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('contact')
                      ? 'text-amber-600'
                      : 'text-foreground hover:text-amber-600'
                  }`}
                  onClick={() => handleNavigate('contact')}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* ─── Mobile Menu (Sheet) ──────────────────────────────────────────── */}
      <Sheet open={mobileMenuOpen} onOpenChange={(open) => !open && closeMobileMenu()}>
        <SheetContent side="left" className="w-[320px] p-0 sm:max-w-[320px]">
          <SheetHeader className="border-b bg-amber-50 px-4 py-4">
            <SheetTitle className="flex items-center gap-2 text-left">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500">
                <Sun className="size-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-primary">Silicon Power</span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-600">
                  Pro
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="px-2 py-2">
              {/* Mobile Search */}
              <button
                onClick={() => {
                  openSearch();
                  closeMobileMenu();
                }}
                className="flex h-10 w-full items-center gap-2 rounded-lg border border-amber-300 bg-amber-50/50 px-3 text-sm text-muted-foreground transition-colors hover:border-amber-500"
              >
                <Search className="size-4 text-amber-600" />
                <span>Search products...</span>
              </button>

              <div className="mt-3 space-y-0.5">
                {/* Home */}
                <MobileNavItem
                  icon={<Lightbulb className="size-4" />}
                  label="Home"
                  active={isActive('home')}
                  onClick={() => handleNavigate('home')}
                />

                {/* Solar Section */}
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="solar" className="border-b-0">
                    <AccordionTrigger
                      className={`flex h-10 items-center gap-3 rounded-md px-3 py-0 text-sm font-medium no-underline transition-colors hover:bg-amber-50 hover:no-underline ${
                        isActive([
                          'solar',
                          'solar-panels',
                          'solar-inverters',
                          'solar-batteries',
                          'solar-structures',
                          'solar-charge-controllers',
                          'solar-accessories',
                          'solar-complete-systems',
                          'solar-builder',
                          'solar-calculator',
                          'solar-ai',
                        ])
                          ? 'text-amber-600'
                          : 'text-foreground'
                      }`}
                    >
                      <Sun className="size-4" />
                      Solar
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pl-6">
                      {solarMenuGroups.map((group) => (
                        <div key={group.title} className="mb-2">
                          <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                            {group.title}
                          </p>
                          {group.items.map((item) => (
                            <MobileSubNavItem
                              key={item.pageId}
                              icon={item.icon}
                              label={item.label}
                              active={isActive(item.pageId)}
                              onClick={() => handleNavigate(item.pageId)}
                            />
                          ))}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Crane Section */}
                  <AccordionItem value="crane" className="border-b-0">
                    <AccordionTrigger
                      className={`flex h-10 items-center gap-3 rounded-md px-3 py-0 text-sm font-medium no-underline transition-colors hover:bg-amber-50 hover:no-underline ${
                        isActive([
                          'crane',
                          'crane-complete',
                          'crane-hooks',
                          'crane-wire-ropes',
                          'crane-bearings',
                          'crane-motors',
                          'crane-gearboxes',
                          'crane-brakes',
                          'crane-electrical',
                          'crane-remote-controls',
                          'crane-accessories',
                          'crane-configurator',
                          'spare-part-finder',
                        ])
                          ? 'text-amber-600'
                          : 'text-foreground'
                      }`}
                    >
                      <Anchor className="size-4" />
                      Crane
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pl-6">
                      {craneMenuGroups.map((group) => (
                        <div key={group.title} className="mb-2">
                          <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                            {group.title}
                          </p>
                          {group.items.map((item) => (
                            <MobileSubNavItem
                              key={item.pageId}
                              icon={item.icon}
                              label={item.label}
                              active={isActive(item.pageId)}
                              onClick={() => handleNavigate(item.pageId)}
                            />
                          ))}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Simple Nav Items */}
                <MobileNavItem
                  icon={<Building2 className="size-4" />}
                  label="Brands"
                  active={isActive('brands')}
                  onClick={() => handleNavigate('brands')}
                />
                <MobileNavItem
                  icon={<GitCompareArrows className="size-4" />}
                  label="Compare"
                  active={isActive('compare')}
                  badge={compareItems.length > 0 ? compareItems.length : undefined}
                  onClick={() => handleNavigate('compare')}
                />
                <MobileNavItem
                  icon={<Construction className="size-4" />}
                  label="Custom Solutions"
                  active={isActive('custom-solutions')}
                  onClick={() => handleNavigate('custom-solutions')}
                />
                <MobileNavItem
                  icon={<BookOpen className="size-4" />}
                  label="Blog"
                  active={isActive('blog')}
                  onClick={() => handleNavigate('blog')}
                />
                <MobileNavItem
                  icon={<Info className="size-4" />}
                  label="About"
                  active={isActive('about')}
                  onClick={() => handleNavigate('about')}
                />
                <MobileNavItem
                  icon={<MessageSquare className="size-4" />}
                  label="Contact"
                  active={isActive('contact')}
                  onClick={() => handleNavigate('contact')}
                />

                <Separator className="my-3" />

                {/* Mobile Action Items */}
                <MobileNavItem
                  icon={<Heart className="size-4" />}
                  label="Wishlist"
                  active={isActive('wishlist')}
                  badge={wishlistItems.length > 0 ? wishlistItems.length : undefined}
                  onClick={() => handleNavigate('wishlist')}
                />
                <MobileNavItem
                  icon={<ShoppingCart className="size-4" />}
                  label="Cart"
                  active={isActive('cart')}
                  badge={cartItemCount > 0 ? cartItemCount : undefined}
                  onClick={() => handleNavigate('cart')}
                />
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-4 px-2">
                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  asChild
                >
                  <a
                    href="https://wa.me/923001234567?text=Hi%2C%20I%27m%20interested%20in%20your%20products"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="size-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
  );
}

// ─── Mobile Nav Item ─────────────────────────────────────────────────────────

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}

function MobileNavItem({ icon, label, active, badge, onClick }: MobileNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
        active
          ? 'bg-amber-50 text-amber-600'
          : 'text-foreground hover:bg-amber-50 hover:text-amber-600'
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <Badge className="bg-amber-500 px-1.5 py-0 text-[10px] font-bold text-white">
          {badge}
        </Badge>
      )}
    </button>
  );
}

// ─── Mobile Sub Nav Item ─────────────────────────────────────────────────────

interface MobileSubNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function MobileSubNavItem({ icon, label, active, onClick }: MobileSubNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-full items-center gap-2 rounded-md px-2 text-[13px] transition-colors ${
        active
          ? 'bg-amber-50 text-amber-600'
          : 'text-foreground/80 hover:bg-amber-50 hover:text-amber-600'
      }`}
    >
      <span className="text-amber-500">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
