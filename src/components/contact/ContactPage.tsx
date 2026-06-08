'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { sendContactEmail } from '@/lib/emailjs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/* ─── Contact Info Card ────────────────────────────────────────────────────── */

function ContactInfoCard({
  icon: Icon,
  title,
  detail,
  subDetail,
  color,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
  subDetail?: string;
  color: string;
}) {
  return (
    <Card className="border-gray-200 bg-white hover:shadow-md transition-shadow p-5">
      <CardContent className="p-0 flex items-start gap-4">
        <div
          className={`inline-flex items-center justify-center size-11 rounded-lg bg-gradient-to-br ${color} shrink-0 shadow-md`}
        >
          <Icon className="size-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{detail}</p>
          {subDetail && (
            <p className="text-xs text-gray-400 mt-0.5">{subDetail}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── FAQ Data ─────────────────────────────────────────────────────────────── */

const faqs = [
  {
    question: 'What brands do you carry?',
    answer:
      'We carry 50+ world-leading brands including Trina Solar, Jinko Solar, Huawei, SMA, Tesla, BYD, Demag, Konecranes, ABB, Siemens, and many more. All products are genuine with full manufacturer warranty.',
  },
  {
    question: 'Do you provide installation services?',
    answer:
      'Yes, we offer professional installation services for both solar and crane products. Our team of certified engineers handles everything from site assessment to commissioning. Installation costs vary by project scope.',
  },
  {
    question: 'What warranty do your products come with?',
    answer:
      'Warranty terms vary by product and manufacturer. Solar panels typically come with 25-30 year linear power warranties and 10-12 year product warranties. Crane products have 12-36 month comprehensive warranties. All warranty details are listed on each product page.',
  },
  {
    question: 'Can you design a custom solar system for my needs?',
    answer:
      'Absolutely! Our AI-powered Solar Builder tool and experienced engineers can design a custom system based on your energy consumption, roof space, and budget. Use our Solar AI tool for instant recommendations or contact us for a detailed consultation.',
  },
  {
    question: 'What are your payment options?',
    answer:
      'We accept bank transfers, credit/debit cards, and offer flexible payment plans for large orders. For projects over $10,000, we can arrange milestone-based payments. Contact our sales team for details.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'In-stock items ship within 2-3 business days. Pre-order and custom items typically take 4-8 weeks depending on the manufacturer. We provide real-time tracking for all orders. Expedited shipping is available at additional cost.',
  },
];

/* ─── Main ContactPage Component ───────────────────────────────────────────── */

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    const result = await sendContactEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#1a1a2e] to-[#0a3d62] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Badge className="bg-amber-500 text-black border-0 font-bold mb-4">
              <Phone className="size-3 mr-1" />
              CONTACT US
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Have questions about our products or need a custom solution? Our
              team of experts is ready to help. Reach out through any channel and
              we&apos;ll respond promptly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Form & Info ──────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-gray-200 bg-white p-6 sm:p-8">
                  <CardContent className="p-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Fill out the form below and we&apos;ll get back to you within
                      24 hours.
                    </p>

                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center size-16 rounded-full bg-emerald-100 mx-auto mb-4">
                          <CheckCircle2 className="size-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Thank you for reaching out. Our team will contact you
                          within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsSubmitted(false);
                            setSubmitError(false);
                            setFormData({
                              name: '',
                              email: '',
                              phone: '',
                              subject: '',
                              message: '',
                            });
                          }}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="John Doe"
                              required
                              className="border-gray-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="john@example.com"
                              required
                              className="border-gray-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+92 300 123 4567"
                              className="border-gray-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <Select
                              value={formData.subject}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  subject: value,
                                }))
                              }
                            >
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">
                                  General Inquiry
                                </SelectItem>
                                <SelectItem value="solar">
                                  Solar Products
                                </SelectItem>
                                <SelectItem value="crane">
                                  Crane Products
                                </SelectItem>
                                <SelectItem value="custom">
                                  Custom Solution
                                </SelectItem>
                                <SelectItem value="support">
                                  Technical Support
                                </SelectItem>
                                <SelectItem value="warranty">
                                  Warranty Claim
                                </SelectItem>
                                <SelectItem value="partnership">
                                  Partnership
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us about your project or question..."
                            required
                            rows={6}
                            className="border-gray-300 resize-none"
                          />
                        </div>

                        {submitError && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="size-4 text-red-500 shrink-0" />
                            <p className="text-sm text-red-600">
                              Failed to send message. Please try again or contact us on WhatsApp.
                            </p>
                          </div>
                        )}

                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="size-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <ContactInfoCard
                  icon={Phone}
                  title="Phone"
                  detail="+92 300 123 4567"
                  subDetail="Mon-Sat, 9am-6pm PKT"
                  color="from-amber-400 to-orange-500"
                />
                <ContactInfoCard
                  icon={MessageSquare}
                  title="WhatsApp"
                  detail="+92 300 123 4567"
                  subDetail="Quick response, 24/7"
                  color="from-green-400 to-emerald-500"
                />
                <ContactInfoCard
                  icon={Mail}
                  title="Email"
                  detail="info@solarcrane.com"
                  subDetail="We reply within 24 hours"
                  color="from-blue-400 to-cyan-500"
                />
                <ContactInfoCard
                  icon={MapPin}
                  title="Office Address"
                  detail="123 Industrial Zone, Lahore"
                  subDetail="Punjab, Pakistan 54000"
                  color="from-red-400 to-rose-500"
                />

                {/* Office Hours */}
                <Card className="border-gray-200 bg-amber-50 p-5">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="size-5 text-amber-600" />
                      <h3 className="font-semibold text-gray-900 text-sm">
                        Office Hours
                      </h3>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-medium">9:00 AM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span className="font-medium text-red-500">Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Map Placeholder ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden border-gray-200 py-0 gap-0">
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="size-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-400">
                  123 Industrial Zone, Lahore, Pakistan
                </p>
              </div>
              {/* Grid overlay for map feel */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-4 h-full w-full">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="border border-gray-400/30" />
                  ))}
                </div>
              </div>
              {/* Pin marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <div className="relative">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="size-5 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-amber-500" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── Social Media ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex items-center justify-center gap-3">
            {[
              { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-100 hover:text-blue-600' },
              { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-100 hover:text-sky-500' },
              { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-100 hover:text-blue-700' },
              { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-100 hover:text-pink-600' },
              { icon: Globe, label: 'Website', color: 'hover:bg-amber-100 hover:text-amber-600' },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <button
                  key={social.label}
                  className={`flex items-center justify-center size-11 rounded-full bg-gray-100 text-gray-500 transition-all ${social.color}`}
                  aria-label={social.label}
                >
                  <Icon className="size-5" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ──────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <Badge className="bg-amber-100 text-amber-700 border-0 font-bold mb-4">
              FAQ
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Find quick answers to common questions about our products and
              services.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-white border border-gray-200 rounded-lg px-4 shadow-sm"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:text-amber-600 hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}