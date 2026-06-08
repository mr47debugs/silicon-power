'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Construction,
  Upload,
  MessageSquare,
  Phone,
  ArrowRight,
  CheckCircle,
  Shield,
  Cpu,
  Users,
  Clock,
  FileText,
  Lightbulb,
  Zap,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { sendCustomSolutionEmail } from '@/lib/emailjs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ─── Benefits Data ────────────────────────────────────────────────────────── */

const benefits = [
  {
    icon: Cpu,
    title: 'Engineered for You',
    description:
      'Our engineers design solutions based on your exact specifications, site conditions, and performance requirements.',
  },
  {
    icon: Shield,
    title: 'Full Warranty',
    description:
      'Custom solutions come with the same comprehensive warranty coverage as our standard products.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description:
      'A dedicated project manager and technical team will guide you from design through installation.',
  },
  {
    icon: Lightbulb,
    title: 'Cost Optimized',
    description:
      'We optimize component selection and system design to deliver maximum value within your budget.',
  },
];

/* ─── Process Steps ────────────────────────────────────────────────────────── */

const processSteps = [
  {
    step: 1,
    title: 'Submit Requirements',
    description: 'Fill out the form with your project details and specifications.',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Expert Review',
    description:
      'Our engineers review your requirements and may ask clarifying questions.',
    icon: Users,
  },
  {
    step: 3,
    title: 'Custom Design',
    description:
      'We design a tailored solution with detailed specifications and pricing.',
    icon: Cpu,
  },
  {
    step: 4,
    title: 'Delivery & Support',
    description:
      'After approval, we deliver and install your custom solution with full support.',
    icon: CheckCircle,
  },
];

/* ─── Main CustomSolutionPage Component ────────────────────────────────────── */

export default function CustomSolutionPage() {
  const [formData, setFormData] = useState({
    category: 'solar',
    projectName: '',
    requirements: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateWhatsAppMessage = () => {
    const lines = [
      '🔧 *Custom Solution Request*',
      '',
      `*Category:* ${formData.category === 'solar' ? 'Solar' : formData.category === 'crane' ? 'Crane' : 'Both Solar & Crane'}`,
      `*Project Name:* ${formData.projectName}`,
      `*Budget:* ${formData.budget || 'Not specified'}`,
      `*Timeline:* ${formData.timeline || 'Not specified'}`,
      '',
      `*Requirements:*`,
      formData.requirements,
      '',
      `*Contact:*`,
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || 'Not provided'}`,
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    const result = await sendCustomSolutionEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      category: formData.category === 'solar' ? 'Solar' : formData.category === 'crane' ? 'Crane' : 'Both',
      project: formData.projectName,
      requirements: formData.requirements,
      budget: formData.budget || 'Not specified',
      timeline: formData.timeline || 'Not specified',
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setSubmitError(true);
    }
  };

  const handleWhatsAppSubmit = () => {
    const message = generateWhatsAppMessage();
    window.open(
      `https://wa.me/923001234567?text=${message}`,
      '_blank'
    );
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
              <Zap className="size-3 mr-1" />
              CUSTOM ENGINEERING
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Request a Custom Solution
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Can&apos;t find what you need? Our engineers can design custom solar or
              crane solutions tailored to your requirements. From specialized
              configurations to complete turnkey systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Form & Side Panel ────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: Form (2 cols) */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-gray-200 bg-white p-6 sm:p-8">
                  <CardContent className="p-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Project Details
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Provide as much detail as possible so our engineers can
                      design the perfect solution.
                    </p>

                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center size-16 rounded-full bg-emerald-100 mx-auto mb-4">
                          <CheckCircle className="size-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Request Submitted!
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                          Our engineering team will review your requirements and
                          contact you within 24 hours with a custom proposal.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold"
                            onClick={handleWhatsAppSubmit}
                          >
                            <MessageSquare className="size-4 mr-2" />
                            Also Send via WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsSubmitted(false);
                              setFormData({
                                category: 'solar',
                                projectName: '',
                                requirements: '',
                                budget: '',
                                timeline: '',
                                name: '',
                                email: '',
                                phone: '',
                              });
                            }}
                          >
                            Submit Another Request
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category */}
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">
                            Solution Category *
                          </Label>
                          <RadioGroup
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                            className="flex flex-col sm:flex-row gap-3"
                          >
                            {[
                              {
                                value: 'solar',
                                label: 'Solar Solution',
                                icon: Sun,
                                color: 'border-amber-400 bg-amber-50',
                              },
                              {
                                value: 'crane',
                                label: 'Crane Solution',
                                icon: Construction,
                                color: 'border-gray-400 bg-gray-50',
                              },
                              {
                                value: 'both',
                                label: 'Both Solar & Crane',
                                icon: Zap,
                                color: 'border-emerald-400 bg-emerald-50',
                              },
                            ].map((option) => {
                              const Icon = option.icon;
                              return (
                                <label
                                  key={option.value}
                                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all flex-1 ${formData.category === option.value
                                    ? option.color + ' shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                  <RadioGroupItem value={option.value} />
                                  <Icon className="size-5" />
                                  <span className="text-sm font-medium">
                                    {option.label}
                                  </span>
                                </label>
                              );
                            })}
                          </RadioGroup>
                        </div>

                        {/* Project Name */}
                        <div className="space-y-2">
                          <Label htmlFor="projectName">
                            Project Name *
                          </Label>
                          <Input
                            id="projectName"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            placeholder="e.g., Factory Rooftop Solar Installation"
                            required
                            className="border-gray-300"
                          />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-2">
                          <Label htmlFor="requirements">
                            Requirements Description *
                          </Label>
                          <Textarea
                            id="requirements"
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="Describe your project in detail. Include site conditions, technical requirements, preferred brands, special considerations, etc."
                            required
                            rows={8}
                            className="border-gray-300 resize-none"
                          />
                        </div>

                        {/* Budget & Timeline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="budget">Budget Range</Label>
                            <Select
                              value={formData.budget}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  budget: value,
                                }))
                              }
                            >
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under-5k">
                                  Under $5,000
                                </SelectItem>
                                <SelectItem value="5k-15k">
                                  $5,000 - $15,000
                                </SelectItem>
                                <SelectItem value="15k-50k">
                                  $15,000 - $50,000
                                </SelectItem>
                                <SelectItem value="50k-100k">
                                  $50,000 - $100,000
                                </SelectItem>
                                <SelectItem value="100k-plus">
                                  $100,000+
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="timeline">Timeline</Label>
                            <Select
                              value={formData.timeline}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  timeline: value,
                                }))
                              }
                            >
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="urgent">
                                  Urgent (ASAP)
                                </SelectItem>
                                <SelectItem value="1-2-weeks">
                                  1-2 Weeks
                                </SelectItem>
                                <SelectItem value="1-month">
                                  1 Month
                                </SelectItem>
                                <SelectItem value="3-months">
                                  3 Months
                                </SelectItem>
                                <SelectItem value="flexible">
                                  Flexible
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Upload Documents (UI only) */}
                        <div className="space-y-2">
                          <Label>Upload Documents</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer">
                            <Upload className="size-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                              Click to upload or drag & drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PDF, DWG, images up to 10MB each
                            </p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">
                            Contact Information
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor="csName" className="text-xs">
                                Full Name *
                              </Label>
                              <Input
                                id="csName"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="border-gray-300"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="csEmail" className="text-xs">
                                Email Address *
                              </Label>
                              <Input
                                id="csEmail"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@company.com"
                                required
                                className="border-gray-300"
                              />
                            </div>
                          </div>
                          <div className="space-y-1 mt-3">
                            <Label htmlFor="csPhone" className="text-xs">
                              Phone Number
                            </Label>
                            <Input
                              id="csPhone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+92 300 123 4567"
                              className="border-gray-300"
                            />
                          </div>
                        </div>

                        {/* Error Message */}
                        {submitError && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="size-4 text-red-500 shrink-0" />
                            <p className="text-sm text-red-600">
                              Failed to submit request. Please try again or send via WhatsApp.
                            </p>
                          </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="size-4 mr-2" />
                                Submit Request
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50 font-bold"
                            onClick={(e) => {
                              e.preventDefault();
                              handleWhatsAppSubmit();
                            }}
                          >
                            <MessageSquare className="size-4 mr-2" />
                            Send via WhatsApp
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: Side Panel */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Why Choose Custom? */}
                <Card className="border-gray-200 bg-white p-6">
                  <CardContent className="p-0 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Why Choose Custom?
                    </h3>
                    <div className="space-y-4">
                      {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                          <div key={benefit.title} className="flex gap-3">
                            <div className="flex items-center justify-center size-9 rounded-lg bg-amber-100 text-amber-600 shrink-0">
                              <Icon className="size-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">
                                {benefit.title}
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Our Process */}
                <Card className="border-gray-200 bg-gradient-to-br from-[#1a1a2e] to-[#0a3d62] p-6">
                  <CardContent className="p-0 space-y-4">
                    <h3 className="text-lg font-bold text-white">Our Process</h3>
                    <div className="space-y-4">
                      {processSteps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                          <div key={step.step} className="flex gap-3">
                            <div className="relative flex items-center justify-center shrink-0">
                              <div className="size-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
                                {step.step}
                              </div>
                              {idx < processSteps.length - 1 && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 bg-amber-500/30" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white">
                                {step.title}
                              </h4>
                              <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Contact */}
                <Card className="border-gray-200 bg-amber-50 p-5">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">
                      Need Immediate Help?
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      Our engineers are available to discuss your project
                      requirements right now.
                    </p>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm"
                      asChild
                    >
                      <a
                        href="https://wa.me/923001234567?text=Hi%2C%20I%20need%20a%20custom%20solution"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="size-4 mr-2" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                    <div className="flex items-center gap-2 mt-3 justify-center">
                      <Phone className="size-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        +92 300 123 4567
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}