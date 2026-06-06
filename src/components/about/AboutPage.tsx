'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Sun,
  Construction,
  Settings,
  Headphones,
  Calendar,
  FolderKanban,
  Award,
  ThumbsUp,
  ArrowRight,
  Phone,
  MessageSquare,
  Target,
  Eye,
  Users,
  Briefcase,
  Shield,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/lib/store';

/* ─── Animated Counter ─────────────────────────────────────────────────────── */

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Stat Card ────────────────────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  value,
  suffix,
  prefix,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="text-center border-gray-200 bg-white hover:shadow-lg transition-shadow p-6">
        <CardContent className="p-0 space-y-3">
          <div
            className={`inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br ${color} mx-auto shadow-lg`}
          >
            <Icon className="size-7 text-white" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            <AnimatedCounter target={value} suffix={suffix} prefix={prefix} />
          </div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Team Member Card ─────────────────────────────────────────────────────── */

function TeamMemberCard({
  name,
  role,
  icon: Icon,
}: {
  name: string;
  role: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="text-center border-gray-200 bg-white hover:shadow-lg transition-all hover:-translate-y-1 p-6">
      <CardContent className="p-0 space-y-3">
        <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0a3d62] flex items-center justify-center">
          <Icon className="size-10 text-amber-400" />
        </div>
        <h3 className="font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </CardContent>
    </Card>
  );
}

/* ─── Main AboutPage Component ─────────────────────────────────────────────── */

export default function AboutPage() {
  const navigate = useNavigationStore((s) => s.navigate);

  const services = [
    {
      icon: Sun,
      title: 'Solar Solutions',
      description:
        'Complete solar energy systems from residential kits to industrial-scale installations. Panels, inverters, batteries, and mounting — all under one roof.',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: Construction,
      title: 'Crane Solutions',
      description:
        'Overhead cranes, hoists, and precision components engineered for safety and performance. Complete systems and spare parts from top manufacturers.',
      color: 'from-gray-600 to-gray-800',
    },
    {
      icon: Settings,
      title: 'Custom Engineering',
      description:
        'Need something unique? Our engineers design custom solar arrays and crane systems tailored to your exact specifications and site conditions.',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      icon: Headphones,
      title: 'Maintenance & Support',
      description:
        'Comprehensive after-sales support including preventive maintenance, emergency repairs, and 24/7 technical assistance for all products.',
      color: 'from-blue-400 to-cyan-500',
    },
  ];

  const stats = [
    {
      icon: Calendar,
      value: 10,
      suffix: '+',
      label: 'Years of Experience',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: FolderKanban,
      value: 5000,
      suffix: '+',
      label: 'Projects Completed',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      icon: Award,
      value: 50,
      suffix: '+',
      label: 'Partner Brands',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: ThumbsUp,
      value: 99,
      suffix: '%',
      label: 'Customer Satisfaction',
      color: 'from-purple-400 to-violet-500',
    },
  ];

  const team = [
    { name: 'Ahmed Khan', role: 'CEO & Founder', icon: Briefcase },
    { name: 'Dr. Sarah Chen', role: 'Chief Technology Officer', icon: Shield },
    { name: 'Mark Thompson', role: 'Head of Crane Operations', icon: Construction },
    { name: 'Elena Rodriguez', role: 'Solar Division Lead', icon: Sun },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#1a1a2e] to-[#0a3d62] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-amber-500 text-black border-0 font-bold mb-4">
              ABOUT US
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Powering Industry.
              <br />
              <span className="text-amber-400">Energizing Tomorrow.</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              SolarCrane Pro is a leading distributor of premium solar energy
              systems and industrial crane solutions. We bridge the gap between
              world-class manufacturers and the businesses that need reliable,
              high-performance equipment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Our Story ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="bg-amber-100 text-amber-700 border-0 font-bold mb-4">
              OUR STORY
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              A Decade of Excellence
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2015, SolarCrane Pro started with a simple vision: to
              make premium industrial equipment accessible to businesses across
              Pakistan and beyond. What began as a small trading company has grown
              into one of the region&apos;s most trusted distributors of solar and
              crane solutions.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our journey has been driven by an unwavering commitment to quality,
              customer service, and technical expertise. We carefully select every
              brand in our portfolio, ensuring that each product meets the highest
              standards of performance and reliability.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we serve over 5,000 businesses — from small installers to
              large industrial conglomerates — with a catalog of 100+ products from
              50+ world-leading manufacturers. Our team of 40+ engineers and
              technicians provides end-to-end support from system design through
              installation and maintenance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Mission & Vision ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                    <Target className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To empower businesses and communities with reliable,
                    high-performance solar and crane solutions by providing genuine
                    products, expert engineering support, and exceptional
                    after-sales service — all at competitive prices.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
                    <Eye className="size-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To be the most trusted partner for industrial equipment in the
                    region, setting the standard for product quality, technical
                    expertise, and customer experience — contributing to a
                    sustainable, efficient, and safe industrial future.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Our Services ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <Badge className="bg-amber-100 text-amber-700 border-0 font-bold mb-4">
              SERVICES
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What We Offer
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-gray-200 bg-white text-center p-6 hover:shadow-lg transition-all hover:border-amber-300 hover:-translate-y-1">
                    <CardContent className="p-0 space-y-4">
                      <div
                        className={`inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br ${service.color} mx-auto shadow-lg`}
                      >
                        <Icon className="size-7 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Statistics ───────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <Badge className="bg-amber-100 text-amber-700 border-0 font-bold mb-4">
              BY THE NUMBERS
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Our Impact
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team Section ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <Badge className="bg-amber-100 text-amber-700 border-0 font-bold mb-4">
              OUR TEAM
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Meet the Experts
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              Our leadership team brings decades of experience in solar energy,
              crane engineering, and industrial solutions.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <TeamMemberCard {...member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a1a2e] to-[#0a3d62] p-8 sm:p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-amber-400" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-amber-400" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to Work with Us?
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
                Whether you need a solar system for your home or an overhead crane
                for your factory, our team is ready to help you find the perfect
                solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
                  onClick={() => navigate('contact')}
                >
                  <Phone className="size-5 mr-2" />
                  Contact Us
                  <ArrowRight className="size-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10 font-bold"
                  asChild
                >
                  <a
                    href="https://wa.me/923001234567?text=Hi%2C%20I%27m%20interested%20in%20your%20products"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="size-5 mr-2" />
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
