// Navigation
export type PageId =
  | 'home' | 'solar' | 'crane' | 'brands' | 'compare' | 'custom-solutions'
  | 'blog' | 'about' | 'contact' | 'cart' | 'wishlist' | 'search'
  | 'solar-panels' | 'solar-inverters' | 'solar-batteries' | 'solar-structures'
  | 'solar-charge-controllers' | 'solar-accessories' | 'solar-complete-systems'
  | 'solar-builder' | 'solar-calculator' | 'solar-ai'
  | 'crane-complete' | 'crane-hooks' | 'crane-wire-ropes' | 'crane-bearings'
  | 'crane-motors' | 'crane-gearboxes' | 'crane-brakes' | 'crane-electrical'
  | 'crane-remote-controls' | 'crane-accessories' | 'crane-configurator'
  | 'spare-part-finder' | 'product' | 'bulk-order';

export interface NavigationState {
  currentPage: PageId;
  selectedProductId: string | null;
  selectedCategory: string | null;
}

// Product
export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  shortDescription: string;
  specifications: Record<string, string>;
  features: string[];
  images: string[];
  price: number;
  estimatedPrice?: string;
  originalPrice?: number;
  availability: 'in-stock' | 'limited' | 'pre-order' | 'out-of-stock';
  warranty: string;
  technology?: string;
  power?: string;
  capacity?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  relatedProductIds: string[];
}

export type ProductCategory = 'solar' | 'crane';

export type SolarSubcategory =
  | 'panels' | 'inverters' | 'batteries' | 'structures'
  | 'charge-controllers' | 'accessories' | 'complete-systems';

export type CraneSubcategory =
  | 'complete-cranes' | 'hooks' | 'wire-ropes' | 'bearings'
  | 'motors' | 'gearboxes' | 'brakes' | 'electrical-components'
  | 'remote-controls' | 'accessories';

// Brand
export interface Brand {
  id: string;
  name: string;
  logo: string;
  category: ProductCategory;
  description: string;
  country: string;
  productCount: number;
}

// Cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// Wishlist
export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

// Compare
export interface CompareItem {
  product: Product;
}

// Review
export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  approved: boolean;
}

// ── Blog ──
export type BlogCategory =
  | 'solar-components' | 'solar-installation' | 'crane-types'
  | 'crane-parts' | 'case-studies' | 'company-news' | 'faqs' | 'config-guides';

// ✅ EXTREME SEO: Full SEO fields on BlogPost
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;

  // ── SEO Fields (NEW) ──
  metaTitle?: string;              // Custom SEO title (falls back to title)
  metaDescription: string;         // Google search result description (150-160 chars)
  keywords: string[];              // Target keywords for this post
  ogImage: string;                 // Open Graph image (1200x630px) for social sharing
  canonicalUrl?: string;           // Override canonical URL if needed

  // ── Author Details (NEW — for JSON-LD & Author Rich Results) ──
  author: string;
  authorUrl?: string;              // Author page/profile URL
  authorImage?: string;            // Author photo URL
  authorJobTitle?: string;         // e.g. "Solar Engineer"

  // ── Publishing (ENHANCED) ──
  date: string;                    // ISO 8601: "2025-01-15"
  dateModified?: string;           // Last updated date (ISO 8601)
  readTime: string;                // e.g. "5 min read"

  // ── Image (ENHANCED) ──
  image: string;
  imageAlt?: string;               // Alt text for SEO + accessibility

  // ── Internal Linking (NEW — crucial for SEO) ──
  tags?: string[];                 // Tags for internal linking & topic clustering
  relatedPostIds?: string[];       // Cross-link to related posts
  faqItems?: FAQItem[];            // FAQ structured data for Google rich results
}

// ✅ NEW: FAQ Structured Data — Google shows FAQ rich results
export interface FAQItem {
  question: string;
  answer: string;
}

// Solar Builder
export interface SolarSystemConfig {
  company: string;
  panelBrand: string;
  panelQuantity: number;
  inverterBrand: string;
  inverterCapacity: string;
  batteryBrand: string;
  batteryQuantity: number;
  structureType: string;
  installation: boolean;
  accessories: string[];
  protectionBox: boolean;
  monitoring: boolean;
}

export interface SolarEstimate {
  estimatedProduction: string;
  estimatedCost: string;
  monthlySavings: string;
  paybackPeriod: string;
  recommendedUpgrades: string[];
}

// Crane Configurator
export interface CraneConfig {
  capacity: string;
  span: string;
  height: string;
  motor: string;
  gearbox: string;
  hook: string;
  wireRope: string;
  remote: string;
  environment: 'indoor' | 'outdoor';
}

// AI Recommendation
export interface SolarAIInput {
  monthlyBill: string;
  houseSize: string;
  backupRequired: boolean;
  appliances: string[];
  budget: string;
  location: string;
}

export interface SolarAIRecommendation {
  panels: string;
  inverter: string;
  battery: string;
  accessories: string[];
  estimatedCost: string;
  estimatedSavings: string;
  paybackPeriod: string;
}

// Filter
export interface FilterOptions {
  brands: string[];
  priceRange: [number, number];
  power?: string[];
  technology?: string[];
  warranty?: string[];
  availability?: string[];
  capacity?: string[];
  material?: string[];
}

export type SortOption = 'popularity' | 'newest' | 'price-low' | 'price-high';

// Hero Slider
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: PageId;
  image: string;
  bgColor: string;
}
