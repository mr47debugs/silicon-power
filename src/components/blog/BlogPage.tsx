'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  User,
  Search,
  ArrowRight,
  Send,
  Sun,
  Construction,
  Wrench,
  Zap,
  Settings,
  FolderOpen,
  HelpCircle,
  Newspaper,
  ChevronRight,
  MessageSquare,
  Loader2,
  Home,
  ChevronLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { blogPosts } from '@/lib/data';
import { sendNewsletterEmail } from '@/lib/emailjs';
import { useNavigationStore } from '@/lib/store';
import type { BlogPost } from '@/lib/types';

/* ─── Category Config (8 categories from PRD) ──────────────────────────────── */

const categoryTabs = [
  { id: 'all', label: 'All', icon: BookOpen },
  { id: 'solar-components', label: 'Solar – Components & Brands', icon: Sun },
  { id: 'solar-installation', label: 'Solar – Installation & Config', icon: Zap },
  { id: 'crane-types', label: 'Crane – Machine Types & Brands', icon: Construction },
  { id: 'crane-parts', label: 'Crane – Parts & Components', icon: Wrench },
  { id: 'case-studies', label: 'Case Studies', icon: FolderOpen },
  { id: 'company-news', label: 'Company News', icon: Newspaper },
  { id: 'faqs', label: 'FAQs & Troubleshooting', icon: HelpCircle },
  { id: 'config-guides', label: 'Configuration Guides', icon: Settings },
] as const;

type CategoryFilter = (typeof categoryTabs)[number]['id'];

function getCategoryIcon(category: string) {
  switch (category) {
    case 'solar-components':
      return <Sun className="size-3" />;
    case 'solar-installation':
      return <Zap className="size-3" />;
    case 'crane-types':
      return <Construction className="size-3" />;
    case 'crane-parts':
      return <Wrench className="size-3" />;
    case 'case-studies':
      return <FolderOpen className="size-3" />;
    case 'company-news':
      return <Newspaper className="size-3" />;
    case 'faqs':
      return <HelpCircle className="size-3" />;
    case 'config-guides':
      return <Settings className="size-3" />;
    default:
      return <BookOpen className="size-3" />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'solar-components':
      return 'bg-amber-100 text-amber-700';
    case 'solar-installation':
      return 'bg-yellow-100 text-yellow-700';
    case 'crane-types':
      return 'bg-slate-200 text-slate-700';
    case 'crane-parts':
      return 'bg-gray-200 text-gray-700';
    case 'case-studies':
      return 'bg-blue-100 text-blue-700';
    case 'company-news':
      return 'bg-emerald-100 text-emerald-700';
    case 'faqs':
      return 'bg-purple-100 text-purple-700';
    case 'config-guides':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getCategoryLabel(category: string) {
  const tab = categoryTabs.find((t) => t.id === category);
  return tab ? tab.label : category;
}

/* ─── SEO: Breadcrumb Component ──────────────────────────────────────────── */

function Breadcrumb() {
  const navigate = useNavigationStore((s) => s.navigate);
  return (
    <nav aria-label="Breadcrumb" className="px-4 sm:px-6 lg:px-8 py-3 bg-gray-50 border-b">
      <ol className="mx-auto max-w-7xl flex items-center gap-2 text-sm text-gray-500">
        <li>
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1 hover:text-amber-600 transition-colors"
          >
            <Home className="size-3.5" />
            <span>Home</span>
          </button>
        </li>
        <li>
          <ChevronRight className="size-3.5 text-gray-300" />
        </li>
        <li>
          <span className="text-gray-900 font-medium" aria-current="page">
            Blog
          </span>
        </li>
      </ol>
    </nav>
  );
}

/* ─── Reference Tables (PRD Section 5) ────────────────────────────────── */

function ReferenceTables() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Quick Reference: Solar Components & Crane Parts</h2>
      {/* Solar Components Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50">
              <th className="text-left px-4 py-3 font-bold text-amber-800 border-b">Component</th>
              <th className="text-left px-4 py-3 font-bold text-amber-800 border-b">Description</th>
              <th className="text-left px-4 py-3 font-bold text-amber-800 border-b">Leading Global Brands</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">Solar Panels (Modules)</td>
              <td className="px-4 py-3 text-gray-600">Convert sunlight directly into electricity. Most recognizable part of any solar installation.</td>
              <td className="px-4 py-3 text-gray-600">JinkoSolar, LONGi, Trina Solar, JA Solar, Canadian Solar, First Solar</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">Inverters</td>
              <td className="px-4 py-3 text-gray-600">Convert DC to AC for home appliances and grid connection.</td>
              <td className="px-4 py-3 text-gray-600">Huawei, Sungrow, SMA, Fronius, SolarEdge, Enphase, GoodWe</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">Mounting Systems</td>
              <td className="px-4 py-3 text-gray-600">Secure panels to roofs, ground, or other surfaces.</td>
              <td className="px-4 py-3 text-gray-600">Schletter, Antaisolar, Van der Valk Solar Systems</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Crane Types & Parts Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-left px-4 py-3 font-bold text-slate-800 border-b">Crane Type</th>
              <th className="text-left px-4 py-3 font-bold text-slate-800 border-b">Leading Brands</th>
              <th className="text-left px-4 py-3 font-bold text-slate-800 border-b">Core Parts & Functions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">All-Terrain & Heavy-Lift</td>
              <td className="px-4 py-3 text-gray-600">Liebherr, Tadano, Manitowoc, Terex</td>
              <td className="px-4 py-3 text-gray-600">Base (stability/mobility), Mast (vertical tower), Boom (extendable arm), Jib (lattice extension), Hoist (winch/cable system), Hook (attachment point), Counterweights (prevent tipping)</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">Tower Cranes</td>
              <td className="px-4 py-3 text-gray-600">Liebherr, Zoomlion, Sany, XCMG</td>
              <td className="px-4 py-3 text-gray-600">Same parts, designed with vertical mast + horizontal jib for high-rise construction</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">Mobile Cranes</td>
              <td className="px-4 py-3 text-gray-600">XCMG, Sany, Zoomlion, Terex, Tadano</td>
              <td className="px-4 py-3 text-gray-600">Same parts, mounted on wheeled chassis for easy transport</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Featured Post ────────────────────────────────────────────────────────── */

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-gray-200 bg-white group hover:shadow-xl transition-all duration-300 py-0 gap-0">
        <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <Badge className="absolute top-4 left-4 bg-amber-500 text-black border-0 text-xs font-bold gap-1">
              {getCategoryIcon(post.category)}
              {getCategoryLabel(post.category)}
            </Badge>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <Badge
              className={`w-fit mb-3 text-xs font-bold border-0 ${getCategoryColor(post.category)}`}
            >
              FEATURED POST
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {post.readTime}
              </span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
            <span className="inline-flex items-center w-fit bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-md text-sm transition-colors">
              Read Article
              <ArrowRight className="size-4 ml-1" />
            </span>
          </div>
        </Link>
      </Card>
    </motion.article>
  );
}

/* ─── Blog Post Card ───────────────────────────────────────────────────────── */

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-gray-200 bg-white group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 py-0 gap-0 h-full flex flex-col">
        <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <Badge
              className={`absolute top-3 left-3 text-[10px] font-bold border-0 gap-1 ${getCategoryColor(post.category)}`}
            >
              {getCategoryIcon(post.category)}
              {getCategoryLabel(post.category)}
            </Badge>
          </div>
          <CardContent className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col">
            <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 flex-1">{post.excerpt}</p>
            {/* ✅ SEO: Tags visible */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {post.readTime}
                </span>
              </div>
              <ChevronRight className="size-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.article>
  );
}

/* ─── Blog Post Detail Modal (kept for backward compat) ────────────────── */

function BlogPostModal({
  post,
  open,
  onClose,
}: {
  post: BlogPost | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="relative aspect-[2/1] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className={`mb-2 text-xs font-bold border-0 gap-1 ${getCategoryColor(post.category)}`}>
              {getCategoryIcon(post.category)}
              {getCategoryLabel(post.category)}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{post.title}</h2>
          </div>
        </div>
        <DialogHeader className="px-6 pt-4 pb-0">
          <DialogTitle className="sr-only">{post.title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-4">
            <span className="flex items-center gap-1">
              <User className="size-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {post.readTime}
            </span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <p className="text-gray-700 leading-relaxed text-base font-medium">{post.excerpt}</p>
          {/* ✅ SEO: Link to dedicated blog post page */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-center">
            <p className="text-amber-800 font-medium mb-3">
              Read the full article with complete technical details.
            </p>
            <Link href={`/blog/${post.slug}`}>
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold">
                Read Full Article
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Sidebar Component ─────────────────────────────────────────────────────── */

function BlogSidebar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: CategoryFilter;
  setActiveCategory: (c: CategoryFilter) => void;
}) {
  const navigate = useNavigationStore((s) => s.navigate);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribing(true);
    try {
      await sendNewsletterEmail(newsletterEmail);
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    } catch {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
    setIsSubscribing(false);
  };

  return (
    <aside className="space-y-6" aria-label="Blog sidebar">
      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Search className="size-4 text-amber-500" />
          Search
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
          <Input
            placeholder="Search by solar component, crane part, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
            aria-label="Search blog posts"
          />
        </div>
      </div>

      {/* Recent Posts — ✅ SEO: Links to /blog/[slug] */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="size-4 text-amber-500" />
          Recent Posts
        </h3>
        <ul className="space-y-2">
          {recentPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="text-left text-sm text-gray-600 hover:text-amber-600 transition-colors line-clamp-2 leading-snug block"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FolderOpen className="size-4 text-amber-500" />
          Categories
        </h3>
        <ul className="space-y-1">
          {categoryTabs
            .filter((t) => t.id !== 'all')
            .map((tab) => {
              const count = categoryCounts[tab.id] || 0;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                    className={`flex items-center justify-between w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                      activeCategory === tab.id
                        ? 'bg-amber-50 text-amber-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <tab.icon className="size-3.5" />
                      {tab.label}
                    </span>
                    <span className="text-xs text-gray-400">({count} posts)</span>
                  </button>
                </li>
              );
            })}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0a3d62] rounded-xl p-5 text-white">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
          <Send className="size-4 text-amber-400" />
          Newsletter
        </h3>
        <p className="text-xs text-gray-300 mb-3 leading-relaxed">
          Get efficient breakdowns of solar components and crane parts – direct to your inbox. No fluff, just technical clarity.
        </p>
        {newsletterSubscribed ? (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-2">
            <span className="text-emerald-400 font-medium text-xs">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="space-y-2">
            <Input
              type="email"
              placeholder="Your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="h-9 text-sm bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400"
              aria-label="Email for newsletter"
            />
            <Button
              type="submit"
              disabled={isSubscribing}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold h-9 text-sm"
            >
              {isSubscribing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <Send className="size-3.5 ml-1" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Promotional Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-5 text-amber-600" />
          <h3 className="text-sm font-bold text-amber-800">Need Something Specific?</h3>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed mb-3">
          Need a specific crane part (hoist, jib, counterweight) or a solar component from a specific brand? We source and configure globally.
        </p>
        <Button
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm h-9"
          onClick={() => navigate('custom-solutions')}
        >
          Request a Quote
          <ArrowRight className="size-3.5 ml-1" />
        </Button>
      </div>
    </aside>
  );
}

/* ─── Newsletter CTA Section ───────────────────────────────────────────────── */

function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      await sendNewsletterEmail(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
      setEmail('');
    }
    setIsSubscribing(false);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50" aria-label="Newsletter signup">
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a1a2e] to-[#0a3d62] p-8 sm:p-12 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center size-14 rounded-xl bg-amber-500 mx-auto mb-4 shadow-lg">
              <Send className="size-7 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Stay Informed</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              Get efficient breakdowns of solar components and crane parts – direct to your inbox. No fluff, just technical clarity.
            </p>
            {subscribed ? (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 inline-flex items-center gap-2">
                <span className="text-emerald-400 font-semibold text-sm">
                  Thank you for subscribing! Check your email for confirmation.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400"
                  aria-label="Email for newsletter"
                />
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-11 shadow-lg shadow-amber-500/25"
                >
                  {isSubscribing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main BlogPage Component ──────────────────────────────────────────────── */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    let result = blogPosts;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const featuredPost = filteredPosts[0] || null;
  const remainingPosts = featuredPost ? filteredPosts.slice(1) : [];

  const handleReadPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ SEO: Breadcrumb Navigation */}
      <Breadcrumb />

      {/* ─── Hero Section (PRD Section 2 & 3) ───────────────────────────── */}
      <header className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge className="bg-amber-500 text-black border-0 font-bold mb-4">
              <BookOpen className="size-3 mr-1" />
              KNOWLEDGE CENTER
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Blog — Complete Guides on Solar Systems & Cranes
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
              Welcome to the Silicon Power blog. We sell and configure every type of solar system available worldwide — including panels from JinkoSolar, LONGi, Trina, inverters from Huawei, Sungrow, SMA, and mounting from Schletter. We also supply all crane types (Liebherr, Tadano, Zoomlion, etc.) and every crane part — from base, mast, boom, jib, hoist, hook, to counterweights.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Our blog breaks down each component efficiently, so you can choose and configure with confidence.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
                onClick={() => {
                  const section = document.getElementById('blog-posts');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Articles
                <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  const section = document.getElementById('reference-tables');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Reference Tables
              </Button>
            </div>
            {/* Contact CTA */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 inline-flex items-center gap-2">
              <p className="text-sm text-gray-300">
                Need a specific brand or part not listed?{' '}
                <button
                  onClick={() => {
                    const navigate = useNavigationStore.getState().navigate;
                    navigate('contact');
                  }}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Contact us for any solar or crane configuration — we source globally.
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ─── Reference Tables (PRD Section 5) ────────────────────────────── */}
      <section id="reference-tables" className="px-4 sm:px-6 lg:px-8 py-10 bg-gray-50" aria-label="Reference tables">
        <div className="mx-auto max-w-7xl">
          <ReferenceTables />
        </div>
      </section>

      {/* ─── Category Filter Tabs ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 bg-white border-b shadow-sm" aria-label="Blog categories">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            role="tablist"
          >
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ─── Main Content Area (Posts + Sidebar) ─────────────────────────── */}
      <main id="blog-posts" className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Posts */}
            <div className="flex-1 min-w-0">
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-8">
                  <FeaturedPost post={featuredPost} />
                </div>
              )}

              {/* Blog Posts Grid */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeCategory === 'all'
                  ? 'Latest Articles'
                  : categoryTabs.find((t) => t.id === activeCategory)?.label}
              </h2>
              {remainingPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {remainingPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : !featuredPost ? (
                <div className="text-center py-16">
                  <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or category filter
                  </p>
                </div>
              ) : null}
            </div>

            {/* Right: Sidebar (desktop) */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-16">
                <BlogSidebar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>
            </div>
          </div>

          {/* Mobile Sidebar (below posts) */}
          <div className="lg:hidden mt-10">
            <BlogSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>
        </div>
      </main>

      {/* ─── Newsletter CTA ─────────────────────────────────────────────── */}
      <NewsletterCTA />

      {/* ─── Blog Post Modal ──────────────────────────────────────────────── */}
      <BlogPostModal
        post={selectedPost}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
      />
    </div>
  );
}