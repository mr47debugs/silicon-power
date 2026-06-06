'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigationStore, useCartStore } from '@/lib/store';
import { craneProducts } from '@/lib/data';
import type { CraneConfig, Product } from '@/lib/types';
import {
  Building2,
  Trees,
  Weight,
  Ruler,
  ArrowUpDown,
  Cog,
  Disc,
  Anchor,
  Cable,
  Radio,
  Gamepad2,
  Castle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  ShoppingCart,
  MessageCircle,
  Wrench,
  Sparkles,
  DollarSign,
  Zap,
  ArrowRight,
} from 'lucide-react';

// ─── Types & Constants ──────────────────────────────────────────────────────

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  { id: 1, title: 'Application', icon: <Building2 className="size-5" /> },
  { id: 2, title: 'Capacity', icon: <Weight className="size-5" /> },
  { id: 3, title: 'Span', icon: <Ruler className="size-5" /> },
  { id: 4, title: 'Lifting Height', icon: <ArrowUpDown className="size-5" /> },
  { id: 5, title: 'Motor', icon: <Cog className="size-5" /> },
  { id: 6, title: 'Gearbox', icon: <Disc className="size-5" /> },
  { id: 7, title: 'Hook', icon: <Anchor className="size-5" /> },
  { id: 8, title: 'Wire Rope', icon: <Cable className="size-5" /> },
  { id: 9, title: 'Remote Control', icon: <Radio className="size-5" /> },
  { id: 10, title: 'Review & Quote', icon: <FileText className="size-5" /> },
];

const CAPACITIES = ['1t', '2t', '3t', '5t', '10t', '16t', '20t', '32t', '50t'];
const MOTOR_BRANDS = ['ABB', 'Siemens', 'Demag', 'Generic'];
const GEARBOX_TYPES = ['Helical', 'Worm', 'Planetary'];
const WIRE_ROPE_DIAMETERS = ['8mm', '10mm', '12mm', '14mm', '16mm', '20mm'];
const REMOTE_TYPES = ['Pendant', 'Radio Remote', 'Cabin'];

const HOOK_CAPACITY_MAP: Record<string, string[]> = {
  '1t': ['1t', '2t', '3t', '5t'],
  '2t': ['2t', '3t', '5t', '10t'],
  '3t': ['3t', '5t', '10t'],
  '5t': ['5t', '10t', '16t'],
  '10t': ['10t', '16t', '20t'],
  '16t': ['16t', '20t', '32t'],
  '20t': ['20t', '32t', '50t'],
  '32t': ['32t', '50t'],
  '50t': ['50t'],
};

// ─── Cost Calculation ───────────────────────────────────────────────────────

function calculateEstimate(config: CraneConfig): number {
  const capacityTons = parseFloat(config.capacity) || 0;
  const spanM = parseFloat(config.span) || 0;
  const heightM = parseFloat(config.height) || 0;

  let cost = 15000; // Base
  cost += capacityTons * 2000; // Capacity factor
  cost += spanM * 500; // Span factor
  cost += heightM * 300; // Height factor

  // Motor premium
  if (config.motor === 'ABB' || config.motor === 'Siemens') cost += 3000;
  if (config.motor === 'Demag') cost += 5000;

  // Remote premium
  if (config.remote === 'Radio Remote') cost += 2500;
  if (config.remote === 'Cabin') cost += 8000;

  return cost;
}

// ─── Selection Card ─────────────────────────────────────────────────────────

function SelectionCard({
  label,
  icon,
  selected,
  onClick,
  description,
}: {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 sm:p-5 transition-all duration-200 hover:shadow-md min-h-[100px] sm:min-h-[110px] ${
        selected
          ? 'border-yellow-500 bg-yellow-50 shadow-md ring-1 ring-yellow-500'
          : 'border-gray-200 bg-white hover:border-yellow-300'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="size-5 text-yellow-600" />
        </div>
      )}
      {icon && (
        <div
          className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
            selected
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-500 group-hover:bg-yellow-100 group-hover:text-yellow-600'
          }`}
        >
          {icon}
        </div>
      )}
      <span
        className={`font-semibold text-sm sm:text-base ${
          selected ? 'text-yellow-700' : 'text-gray-700'
        }`}
      >
        {label}
      </span>
      {description && (
        <span className="text-xs text-gray-400 text-center leading-tight">
          {description}
        </span>
      )}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CraneConfiguratorPage() {
  const navigate = useNavigationStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);

  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<CraneConfig>({
    capacity: '',
    span: '15',
    height: '10',
    motor: '',
    gearbox: '',
    hook: '',
    wireRope: '',
    remote: '',
    environment: 'indoor',
  });

  const updateConfig = (key: keyof CraneConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const estimatedCost = useMemo(() => calculateEstimate(config), [config]);

  // Suggested parts based on config
  const suggestedParts = useMemo(() => {
    const parts: Product[] = [];
    if (config.motor) {
      const motors = craneProducts.filter((p) => p.subcategory === 'motors');
      if (motors.length) parts.push(...motors.slice(0, 2));
    }
    if (config.gearbox) {
      const gearboxes = craneProducts.filter((p) => p.subcategory === 'gearboxes');
      if (gearboxes.length) parts.push(...gearboxes.slice(0, 2));
    }
    const hooks = craneProducts.filter((p) => p.subcategory === 'hooks');
    if (hooks.length) parts.push(...hooks.slice(0, 2));
    const wireRopes = craneProducts.filter((p) => p.subcategory === 'wire-ropes');
    if (wireRopes.length) parts.push(...wireRopes.slice(0, 2));
    const remotes = craneProducts.filter((p) => p.subcategory === 'remote-controls');
    if (remotes.length) parts.push(...remotes.slice(0, 2));
    // Deduplicate
    const seen = new Set<string>();
    return parts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [config.motor, config.gearbox]);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return !!config.environment;
      case 2: return !!config.capacity;
      case 3: return parseFloat(config.span) >= 5 && parseFloat(config.span) <= 40;
      case 4: return parseFloat(config.height) >= 3 && parseFloat(config.height) <= 30;
      case 5: return !!config.motor;
      case 6: return !!config.gearbox;
      case 7: return !!config.hook;
      case 8: return !!config.wireRope;
      case 9: return !!config.remote;
      case 10: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 10) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleAddToCart = () => {
    // Create a virtual crane product for cart
    const virtualProduct: Product = {
      id: `crane-config-${Date.now()}`,
      name: `Custom ${config.capacity} Crane - ${config.span}m Span`,
      slug: `custom-crane-${config.capacity}-${config.span}m`,
      brand: 'Custom Configuration',
      category: 'crane',
      subcategory: 'complete-cranes',
      description: `Custom configured crane: ${config.capacity} capacity, ${config.span}m span, ${config.height}m lifting height, ${config.motor} motor, ${config.gearbox} gearbox, ${config.hook} hook, ${config.wireRope} wire rope, ${config.remote} control, ${config.environment} application.`,
      shortDescription: `Custom ${config.capacity} crane configuration`,
      specifications: {
        Capacity: config.capacity,
        Span: `${config.span}m`,
        'Lifting Height': `${config.height}m`,
        Motor: config.motor,
        Gearbox: config.gearbox,
        Hook: config.hook,
        'Wire Rope': config.wireRope,
        Control: config.remote,
        Environment: config.environment,
      },
      features: [],
      images: ['https://placehold.co/600x400/1a1a2e/ffd700?text=Custom+Crane'],
      price: estimatedCost,
      availability: 'pre-order',
      warranty: '24-month comprehensive',
      capacity: config.capacity,
      rating: 5,
      reviewCount: 0,
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      relatedProductIds: [],
    };
    addItem(virtualProduct, 1);
  };

  const generateWhatsAppMessage = () => {
    const msg = encodeURIComponent(
      `Hi, I'd like a quote for a custom crane configuration:\n\n` +
      `• Application: ${config.environment}\n` +
      `• Capacity: ${config.capacity}\n` +
      `• Span: ${config.span}m\n` +
      `• Lifting Height: ${config.height}m\n` +
      `• Motor: ${config.motor}\n` +
      `• Gearbox: ${config.gearbox}\n` +
      `• Hook: ${config.hook}\n` +
      `• Wire Rope: ${config.wireRope}\n` +
      `• Remote: ${config.remote}\n\n` +
      `Estimated Cost: $${estimatedCost.toLocaleString()}`
    );
    return `https://wa.me/923001234567?text=${msg}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      // Step 1: Application
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Where will the crane operate?
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Select the operating environment for your crane
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectionCard
                label="Indoor"
                icon={<Building2 className="size-5" />}
                description="Warehouse, factory, workshop — controlled environment"
                selected={config.environment === 'indoor'}
                onClick={() => updateConfig('environment', 'indoor')}
              />
              <SelectionCard
                label="Outdoor"
                icon={<Trees className="size-5" />}
                description="Shipping yard, construction site — weather exposed"
                selected={config.environment === 'outdoor'}
                onClick={() => updateConfig('environment', 'outdoor')}
              />
            </div>
          </div>
        );

      // Step 2: Capacity
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                What lifting capacity do you need?
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Select the maximum load the crane will handle
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {CAPACITIES.map((cap) => (
                <SelectionCard
                  key={cap}
                  label={cap}
                  selected={config.capacity === cap}
                  onClick={() => {
                    updateConfig('capacity', cap);
                    // Auto-select hook
                    const validHooks = HOOK_CAPACITY_MAP[cap] || [];
                    if (validHooks.length && !validHooks.includes(config.hook)) {
                      updateConfig('hook', validHooks[0]);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        );

      // Step 3: Span
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                What is the crane span?
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Distance between the runway rails (5m - 40m)
              </p>
            </div>
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Span</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={5}
                      max={40}
                      value={config.span}
                      onChange={(e) => {
                        const val = Math.min(40, Math.max(5, parseFloat(e.target.value) || 5));
                        updateConfig('span', val.toString());
                      }}
                      className="w-20 text-center text-lg font-bold h-10"
                    />
                    <span className="text-lg font-semibold text-gray-700">m</span>
                  </div>
                </div>
                <Slider
                  value={[parseFloat(config.span)]}
                  onValueChange={(val) => updateConfig('span', val[0].toString())}
                  min={5}
                  max={40}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5m</span>
                  <span>20m</span>
                  <span>40m</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // Step 4: Lifting Height
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                What is the lifting height?
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Maximum height the hook needs to reach (3m - 30m)
              </p>
            </div>
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Lifting Height</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={3}
                      max={30}
                      value={config.height}
                      onChange={(e) => {
                        const val = Math.min(30, Math.max(3, parseFloat(e.target.value) || 3));
                        updateConfig('height', val.toString());
                      }}
                      className="w-20 text-center text-lg font-bold h-10"
                    />
                    <span className="text-lg font-semibold text-gray-700">m</span>
                  </div>
                </div>
                <Slider
                  value={[parseFloat(config.height)]}
                  onValueChange={(val) => updateConfig('height', val[0].toString())}
                  min={3}
                  max={30}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>3m</span>
                  <span>15m</span>
                  <span>30m</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // Step 5: Motor
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Select the motor brand
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Premium brands offer better efficiency and warranty
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MOTOR_BRANDS.map((brand) => (
                <SelectionCard
                  key={brand}
                  label={brand}
                  icon={<Cog className="size-5" />}
                  description={
                    brand === 'ABB' || brand === 'Siemens'
                      ? 'Premium quality +$3,000'
                      : brand === 'Demag'
                      ? 'Industry leading +$5,000'
                      : 'Standard quality'
                  }
                  selected={config.motor === brand}
                  onClick={() => updateConfig('motor', brand)}
                />
              ))}
            </div>
          </div>
        );

      // Step 6: Gearbox
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Select the gearbox type
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Each type offers different efficiency and torque characteristics
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectionCard
                label="Helical"
                icon={<Disc className="size-5" />}
                description="High efficiency, quiet operation, compact design"
                selected={config.gearbox === 'Helical'}
                onClick={() => updateConfig('gearbox', 'Helical')}
              />
              <SelectionCard
                label="Worm"
                icon={<Disc className="size-5" />}
                description="Self-locking, right-angle drive, cost effective"
                selected={config.gearbox === 'Worm'}
                onClick={() => updateConfig('gearbox', 'Worm')}
              />
              <SelectionCard
                label="Planetary"
                icon={<Disc className="size-5" />}
                description="Highest torque density, precision, compact"
                selected={config.gearbox === 'Planetary'}
                onClick={() => updateConfig('gearbox', 'Planetary')}
              />
            </div>
          </div>
        );

      // Step 7: Hook
      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Select the hook capacity
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Must match or exceed your crane capacity ({config.capacity || 'not set'})
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(HOOK_CAPACITY_MAP[config.capacity] || CAPACITIES).map((hook) => (
                <SelectionCard
                  key={hook}
                  label={hook}
                  icon={<Anchor className="size-5" />}
                  selected={config.hook === hook}
                  onClick={() => updateConfig('hook', hook)}
                />
              ))}
            </div>
          </div>
        );

      // Step 8: Wire Rope
      case 8:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Select wire rope diameter
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Thicker ropes offer higher breaking strength
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {WIRE_ROPE_DIAMETERS.map((dia) => (
                <SelectionCard
                  key={dia}
                  label={dia}
                  selected={config.wireRope === dia}
                  onClick={() => updateConfig('wireRope', dia)}
                />
              ))}
            </div>
          </div>
        );

      // Step 9: Remote Control
      case 9:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Select the control method
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Choose how the operator will control the crane
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectionCard
                label="Pendant"
                icon={<Gamepad2 className="size-5" />}
                description="Wired control, reliable, included in base price"
                selected={config.remote === 'Pendant'}
                onClick={() => updateConfig('remote', 'Pendant')}
              />
              <SelectionCard
                label="Radio Remote"
                icon={<Radio className="size-5" />}
                description="Wireless freedom +$2,500, safer operation"
                selected={config.remote === 'Radio Remote'}
                onClick={() => updateConfig('remote', 'Radio Remote')}
              />
              <SelectionCard
                label="Cabin"
                icon={<Castle className="size-5" />}
                description="Enclosed operator cabin +$8,000, full visibility"
                selected={config.remote === 'Cabin'}
                onClick={() => updateConfig('remote', 'Cabin')}
              />
            </div>
          </div>
        );

      // Step 10: Review & Quote
      case 10:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Configuration Summary
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Review your crane configuration and estimated cost
              </p>
            </div>

            {/* Summary Card */}
            <Card className="border-yellow-500 bg-gradient-to-br from-yellow-50 to-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-yellow-500 text-white">
                    <Zap className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      Custom {config.capacity} Crane
                    </h4>
                    <p className="text-sm text-gray-500">
                      {config.environment === 'indoor' ? 'Indoor' : 'Outdoor'} Application
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400 uppercase">Estimated Cost</p>
                    <p className="text-2xl font-extrabold text-gray-900">
                      ${estimatedCost.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Capacity', value: config.capacity },
                    { label: 'Span', value: `${config.span}m` },
                    { label: 'Lifting Height', value: `${config.height}m` },
                    { label: 'Motor', value: config.motor },
                    { label: 'Gearbox', value: config.gearbox },
                    { label: 'Hook', value: config.hook },
                    { label: 'Wire Rope', value: config.wireRope },
                    { label: 'Control', value: config.remote },
                    { label: 'Environment', value: config.environment === 'indoor' ? 'Indoor' : 'Outdoor' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="font-semibold text-gray-900 capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="border-gray-200">
              <CardContent className="p-6 space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="size-5 text-yellow-500" />
                  Cost Breakdown
                </h4>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Cost</span>
                    <span className="font-medium">$15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Capacity ({config.capacity}) × $2,000/t
                    </span>
                    <span className="font-medium">
                      ${(parseFloat(config.capacity) * 2000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Span ({config.span}m) × $500/m
                    </span>
                    <span className="font-medium">
                      ${(parseFloat(config.span) * 500).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Height ({config.height}m) × $300/m
                    </span>
                    <span className="font-medium">
                      ${(parseFloat(config.height) * 300).toLocaleString()}
                    </span>
                  </div>
                  {(config.motor === 'ABB' || config.motor === 'Siemens') && (
                    <div className="flex justify-between text-yellow-700">
                      <span>{config.motor} Motor Premium</span>
                      <span className="font-medium">+$3,000</span>
                    </div>
                  )}
                  {config.motor === 'Demag' && (
                    <div className="flex justify-between text-yellow-700">
                      <span>Demag Motor Premium</span>
                      <span className="font-medium">+$5,000</span>
                    </div>
                  )}
                  {config.remote === 'Radio Remote' && (
                    <div className="flex justify-between text-yellow-700">
                      <span>Radio Remote Control</span>
                      <span className="font-medium">+$2,500</span>
                    </div>
                  )}
                  {config.remote === 'Cabin' && (
                    <div className="flex justify-between text-yellow-700">
                      <span>Operator Cabin</span>
                      <span className="font-medium">+$8,000</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
                    <span>Estimated Total</span>
                    <span className="text-yellow-600">
                      ${estimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">
                  * Final pricing may vary based on site conditions, installation, and shipping
                </p>
              </CardContent>
            </Card>

            {/* Suggested Parts */}
            {suggestedParts.length > 0 && (
              <Card className="border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="size-5 text-yellow-500" />
                    Suggested Parts for Your Configuration
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {suggestedParts.slice(0, 6).map((part) => (
                      <div
                        key={part.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => navigate('product', part.id)}
                      >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 shrink-0">
                          <Wrench className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {part.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {part.brand} • ${part.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 text-sm"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="size-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-sm"
                asChild
              >
                <a href={generateWhatsAppMessage()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-5 mr-2" />
                  Get Quote on WhatsApp
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 h-12 text-sm font-semibold"
                onClick={() => {
                  // Generate simple text file download
                  const text = [
                    'CRANE CONFIGURATION QUOTE',
                    '==========================',
                    `Date: ${new Date().toLocaleDateString()}`,
                    '',
                    'SPECIFICATIONS',
                    `Application: ${config.environment}`,
                    `Capacity: ${config.capacity}`,
                    `Span: ${config.span}m`,
                    `Lifting Height: ${config.height}m`,
                    `Motor: ${config.motor}`,
                    `Gearbox: ${config.gearbox}`,
                    `Hook: ${config.hook}`,
                    `Wire Rope: ${config.wireRope}`,
                    `Control: ${config.remote}`,
                    '',
                    'ESTIMATED COST',
                    `Total: $${estimatedCost.toLocaleString()}`,
                    '',
                    '* This is an estimate. Contact us for a final quote.',
                  ].join('\n');
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `crane-quote-${config.capacity}-${Date.now()}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <FileText className="size-5 mr-2" />
                Download Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 h-12 text-sm font-semibold"
                onClick={() => navigate('custom-solutions')}
              >
                <Wrench className="size-5 mr-2" />
                Request Custom Engineering
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate('home')}
                className="cursor-pointer text-gray-500 hover:text-yellow-600"
              >
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate('crane')}
                className="cursor-pointer text-gray-500 hover:text-yellow-600"
              >
                Crane
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-sm font-medium text-gray-900">
                Crane Configurator
              </span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-lg">
              <Wrench className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Crane Configurator
              </h1>
              <p className="text-sm text-gray-500">
                Build your custom crane step by step
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-1 min-w-max">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => {
                    // Only allow navigating to completed steps or current
                    if (step.id <= currentStep) setCurrentStep(step.id);
                  }}
                  className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-all ${
                    step.id === currentStep
                      ? 'bg-yellow-50 text-yellow-700'
                      : step.id < currentStep
                      ? 'text-yellow-600 hover:bg-yellow-50 cursor-pointer'
                      : 'text-gray-300'
                  }`}
                >
                  <div
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      step.id === currentStep
                        ? 'bg-yellow-500 text-white'
                        : step.id < currentStep
                        ? 'bg-yellow-200 text-yellow-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium hidden sm:block">
                    {step.title}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-4 sm:w-6 rounded-full transition-colors ${
                      step.id < currentStep ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="animate-in fade-in duration-300">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>

          {currentStep < 10 ? (
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2"
            >
              <ShoppingCart className="size-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
