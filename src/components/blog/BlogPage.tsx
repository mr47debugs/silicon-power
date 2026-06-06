'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  User,
  Search,
  Filter,
  ArrowRight,
  X,
  Send,
  Sun,
  Construction,
  Wrench,
  ShoppingCart,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { blogPosts } from '@/lib/data';
import type { BlogPost } from '@/lib/types';

/* ─── Category Config ─────────────────────────────────────────────────────── */

const categoryTabs = [
  { id: 'all', label: 'All', icon: BookOpen },
  { id: 'solar-guides', label: 'Solar Guides', icon: Sun },
  { id: 'crane-guides', label: 'Crane Guides', icon: Construction },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'buying-guides', label: 'Buying Guides', icon: ShoppingCart },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
] as const;

type CategoryFilter = (typeof categoryTabs)[number]['id'];

function getCategoryIcon(category: string) {
  switch (category) {
    case 'solar-guides':
      return <Sun className="size-3" />;
    case 'crane-guides':
      return <Construction className="size-3" />;
    case 'maintenance':
      return <Wrench className="size-3" />;
    case 'buying-guides':
      return <ShoppingCart className="size-3" />;
    case 'trends':
      return <TrendingUp className="size-3" />;
    default:
      return <BookOpen className="size-3" />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'solar-guides':
      return 'bg-amber-100 text-amber-700';
    case 'crane-guides':
      return 'bg-gray-200 text-gray-700';
    case 'maintenance':
      return 'bg-blue-100 text-blue-700';
    case 'buying-guides':
      return 'bg-emerald-100 text-emerald-700';
    case 'trends':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/* ─── Featured Post ────────────────────────────────────────────────────────── */

function FeaturedPost({ post, onRead }: { post: BlogPost; onRead: (p: BlogPost) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="overflow-hidden border-gray-200 bg-white cursor-pointer group hover:shadow-xl transition-all duration-300 py-0 gap-0"
        onClick={() => onRead(post)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <Badge className="absolute top-4 left-4 bg-amber-500 text-black border-0 text-xs font-bold gap-1">
              {getCategoryIcon(post.category)}
              {post.category.replace('-', ' ').toUpperCase()}
            </Badge>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <Badge
              className={`w-fit mb-3 text-xs font-bold border-0 ${getCategoryColor(
                post.category
              )}`}
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
              <span>
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <Button
              className="w-fit bg-amber-500 hover:bg-amber-400 text-black font-bold"
              onClick={(e) => {
                e.stopPropagation();
                onRead(post);
              }}
            >
              Read Article
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── Blog Post Card ───────────────────────────────────────────────────────── */

function BlogPostCard({ post, onRead }: { post: BlogPost; onRead: (p: BlogPost) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="overflow-hidden border-gray-200 bg-white cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 py-0 gap-0"
        onClick={() => onRead(post)}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <Badge
            className={`absolute top-3 left-3 text-[10px] font-bold border-0 gap-1 ${getCategoryColor(
              post.category
            )}`}
          >
            {getCategoryIcon(post.category)}
            {post.category.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        <CardContent className="p-4 sm:p-5 space-y-2">
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
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
      </Card>
    </motion.div>
  );
}

/* ─── Blog Post Detail Modal ───────────────────────────────────────────────── */

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
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge
              className={`mb-2 text-xs font-bold border-0 gap-1 ${getCategoryColor(
                post.category
              )}`}
            >
              {getCategoryIcon(post.category)}
              {post.category.replace('-', ' ').toUpperCase()}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {post.title}
            </h2>
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
            <span>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed text-base">
              {post.excerpt}
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Solar and crane technologies continue to evolve rapidly, and staying
              informed about the latest developments is crucial for making smart
              purchasing decisions. In this comprehensive guide, we explore the key
              factors that professionals and homeowners should consider when
              evaluating their options.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">
              Key Considerations
            </h3>
            <p className="text-gray-600 leading-relaxed">
              When evaluating products in this category, it&apos;s important to
              consider efficiency ratings, warranty terms, manufacturer reputation,
              and total cost of ownership. Our team of experts has analyzed dozens of
              products and distilled the most important factors into actionable
              insights.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">
              Expert Recommendations
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Based on our extensive testing and real-world feedback from thousands
              of customers, we recommend prioritizing products with proven track
              records, comprehensive warranty coverage, and strong manufacturer
              support. The products featured in our catalog meet these exacting
              standards.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">
              Conclusion
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Making the right choice requires careful research and expert guidance.
              Whether you&apos;re a first-time buyer or upgrading existing equipment,
              our team is here to help you find the perfect solution for your needs.
              Contact us for a free consultation and personalized recommendation.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main BlogPage Component ──────────────────────────────────────────────── */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

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
          p.author.toLowerCase().includes(q)
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] overflow-hidden">
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
              <BookOpen className="size-3 mr-1" />
              KNOWLEDGE CENTER
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Knowledge Center
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              Expert guides, maintenance tips, buying advice, and industry trends
              to help you make informed decisions about solar and crane solutions.
            </p>
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Category Filter Tabs ─────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
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
      </section>

      {/* ─── Featured Post ────────────────────────────────────────────────── */}
      {featuredPost && (
        <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <div className="mx-auto max-w-7xl">
            <FeaturedPost post={featuredPost} onRead={handleReadPost} />
          </div>
        </section>
      )}

      {/* ─── Blog Posts Grid ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {activeCategory === 'all'
              ? 'Latest Articles'
              : categoryTabs.find((t) => t.id === activeCategory)?.label}
          </h2>
          {remainingPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {remainingPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} onRead={handleReadPost} />
              ))}
            </div>
          ) : !featuredPost ? (
            <div className="text-center py-16">
              <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ─── Newsletter CTA ───────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Stay Informed
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Subscribe to our newsletter for the latest guides, industry insights,
                and exclusive offers delivered to your inbox.
              </p>
              {newsletterSubscribed ? (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 inline-flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold text-sm">
                    Thank you for subscribing! Check your email for confirmation.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-11 shadow-lg shadow-amber-500/25"
                  >
                    Subscribe
                    <Send className="size-4 ml-2" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

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
