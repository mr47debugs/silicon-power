// ─── Re-export everything from category files ──────────────────────────────

export { solarProducts } from './solar-products';
export { craneProducts } from './crane-products';
export { brands } from './brands';
export { blogPosts, getBlogPostBySlug, getAllBlogSlugs, getRelatedPosts } from './blog-posts';
export { heroSlides } from './hero-slides';
export { customerReviews } from './reviews';

// ─── Combined arrays ───────────────────────────────────────────────────────

import { solarProducts } from './solar-products';
import { craneProducts } from './crane-products';

export const allProducts = [...solarProducts, ...craneProducts];

// ─── Filtered arrays ───────────────────────────────────────────────────────

export const completeSolarSystems = solarProducts.filter(
  (p) => p.subcategory === 'complete-systems'
);

export const completeCraneSolutions = craneProducts.filter(
  (p) => p.subcategory === 'complete-cranes'
);