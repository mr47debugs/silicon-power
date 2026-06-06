'use client';

import React, { useState } from 'react';
import {
  Sun,
  Anchor,
  Zap,
  Battery,
  Frame,
  Gauge,
  Wrench,
  LayoutGrid,
  Construction,
  Calculator,
  Bot,
  Cable,
  CircleDot,
  Cog,
  Disc,
  CircuitBoard,
  Radio,
  Settings,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Send,
  Shield,
  Truck,
  RefreshCw,
  HelpCircle,
  FileText,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useNavigationStore } from '@/lib/store';
import type { PageId } from '@/lib/types';

// ─── Data ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  pageId: PageId;
  icon?: React.ReactNode;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const solarLinks: FooterLink[] = [
  { label: 'Solar Panels', pageId: 'solar-panels', icon: <Sun className="size-3.5" /> },
  { label: 'Inverters', pageId: 'solar-inverters', icon: <Zap className="size-3.5" /> },
  { label: 'Batteries', pageId: 'solar-batteries', icon: <Battery className="size-3.5" /> },
  { label: 'Structures', pageId: 'solar-structures', icon: <Frame className="size-3.5" /> },
  { label: 'Charge Controllers', pageId: 'solar-charge-controllers', icon: <Gauge className="size-3.5" /> },
  { label: 'Accessories', pageId: 'solar-accessories', icon: <Wrench className="size-3.5" /> },
  { label: 'Complete Systems', pageId: 'solar-complete-systems', icon: <LayoutGrid className="size-3.5" /> },
  { label: 'Solar Builder', pageId: 'solar-builder', icon: <Construction className="size-3.5" /> },
  { label: 'Solar Calculator', pageId: 'solar-calculator', icon: <Calculator className="size-3.5" /> },
  { label: 'AI Recommendation', pageId: 'solar-ai', icon: <Bot className="size-3.5" /> },
];

const craneLinks: FooterLink[] = [
  { label: 'Complete Cranes', pageId: 'crane-complete', icon: <Anchor className="size-3.5" /> },
  { label: 'Hooks', pageId: 'crane-hooks', icon: <Cable className="size-3.5" /> },
  { label: 'Wire Ropes', pageId: 'crane-wire-ropes', icon: <Cable className="size-3.5" /> },
  { label: 'Bearings', pageId: 'crane-bearings', icon: <CircleDot className="size-3.5" /> },
  { label: 'Motors', pageId: 'crane-motors', icon: <Cog className="size-3.5" /> },
  { label: 'Gearboxes', pageId: 'crane-gearboxes', icon: <Disc className="size-3.5" /> },
  { label: 'Brakes', pageId: 'crane-brakes', icon: <Disc className="size-3.5" /> },
  { label: 'Electrical', pageId: 'crane-electrical', icon: <CircuitBoard className="size-3.5" /> },
  { label: 'Remote Controls', pageId: 'crane-remote-controls', icon: <Radio className="size-3.5" /> },
  { label: 'Accessories', pageId: 'crane-accessories', icon: <Settings className="size-3.5" /> },
  { label: 'Crane Configurator', pageId: 'crane-configurator', icon: <Construction className="size-3.5" /> },
  { label: 'Spare Part Finder', pageId: 'spare-part-finder', icon: <Wrench className="size-3.5" /> },
];

const companyLinks: FooterLink[] = [
  { label: 'About Us', pageId: 'about' },
  { label: 'Blog', pageId: 'blog' },
  { label: 'Contact', pageId: 'contact' },
  { label: 'Custom Solutions', pageId: 'custom-solutions' },
  { label: 'Brands', pageId: 'brands' },
];

const supportLinks: FooterLink[] = [
  { label: 'FAQ', pageId: 'about', icon: <HelpCircle className="size-3.5" /> },
  { label: 'Shipping Info', pageId: 'about', icon: <Truck className="size-3.5" /> },
  { label: 'Returns Policy', pageId: 'about', icon: <RefreshCw className="size-3.5" /> },
  { label: 'Warranty', pageId: 'about', icon: <Shield className="size-3.5" /> },
  { label: 'Payment Methods', pageId: 'about', icon: <CreditCard className="size-3.5" /> },
  { label: 'Terms & Conditions', pageId: 'about', icon: <FileText className="size-3.5" /> },
];

const socialLinks = [
  { label: 'Facebook', icon: <Facebook className="size-4" />, href: '#' },
  { label: 'Twitter', icon: <Twitter className="size-4" />, href: '#' },
  { label: 'Instagram', icon: <Instagram className="size-4" />, href: '#' },
  { label: 'LinkedIn', icon: <Linkedin className="size-4" />, href: '#' },
  { label: 'YouTube', icon: <Youtube className="size-4" />, href: '#' },
];

// ─── Footer Component ────────────────────────────────────────────────────────

export default function Footer() {
  const navigate = useNavigationStore((s) => s.navigate);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNavigate = (pageId: PageId) => {
    navigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* ─── Newsletter Banner ──────────────────────────────────────────────── */}
      <div className="border-b border-primary-foreground/10 bg-amber-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Send className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white sm:text-base">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-xs text-white/80">
                Get exclusive deals, new product alerts & expert tips
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-sm gap-2"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-white/30"
              required
            />
            <Button
              type="submit"
              className="h-10 shrink-0 bg-white text-amber-700 hover:bg-white/90"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
              {!subscribed && <ArrowRight className="ml-1 size-4" />}
            </Button>
          </form>
        </div>
      </div>

      {/* ─── Main Footer Content ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Solar Categories */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
              <Sun className="size-4" />
              Solar
            </h3>
            <ul className="space-y-2">
              {solarLinks.map((link) => (
                <li key={link.pageId}>
                  <button
                    onClick={() => handleNavigate(link.pageId)}
                    className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-amber-400"
                  >
                    {link.icon}
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Crane Categories */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
              <Anchor className="size-4" />
              Crane
            </h3>
            <ul className="space-y-2">
              {craneLinks.map((link) => (
                <li key={link.pageId}>
                  <button
                    onClick={() => handleNavigate(link.pageId)}
                    className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-amber-400"
                  >
                    {link.icon}
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-400">
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavigate(link.pageId)}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-400">
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavigate(link.pageId)}
                    className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-amber-400"
                  >
                    {link.icon}
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-400">
              Connect
            </h3>

            {/* Contact Info */}
            <div className="mb-5 space-y-3">
              <a
                href="tel:+923001234567"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-amber-400"
              >
                <Phone className="size-3.5 shrink-0" />
                +92 300 123 4567
              </a>
              <a
                href="mailto:info@solarcrane.com"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-amber-400"
              >
                <Mail className="size-3.5 shrink-0" />
                info@solarcrane.com
              </a>
              <div className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>Industrial Area, Lahore, Pakistan</span>
              </div>
            </div>

            {/* WhatsApp */}
            <Button
              variant="outline"
              className="mb-5 w-full border-green-500/50 bg-green-600/10 text-green-400 hover:bg-green-600/20 hover:text-green-300"
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

            {/* Social Media */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
                Follow Us
              </p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-8 items-center justify-center rounded-md bg-primary-foreground/10 text-primary-foreground/60 transition-colors hover:bg-amber-500 hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─────────────────────────────────────────────────────── */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-amber-500">
              <Sun className="size-3.5 text-white" />
            </div>
            <span className="text-sm text-primary-foreground/50">
              &copy; {new Date().getFullYear()} SolarCrane Pro. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/50">
            <button
              onClick={() => handleNavigate('about')}
              className="transition-colors hover:text-amber-400"
            >
              Privacy Policy
            </button>
            <span className="text-primary-foreground/20">|</span>
            <button
              onClick={() => handleNavigate('about')}
              className="transition-colors hover:text-amber-400"
            >
              Terms of Service
            </button>
            <span className="text-primary-foreground/20">|</span>
            <button
              onClick={() => handleNavigate('about')}
              className="transition-colors hover:text-amber-400"
            >
              Sitemap
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
