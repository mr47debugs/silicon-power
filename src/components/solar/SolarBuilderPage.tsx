'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigationStore, useCartStore } from '@/lib/store';
import { solarProducts } from '@/lib/data';
import type { SolarSystemConfig } from '@/lib/types';
import {
  Sun,
  Zap,
  Battery,
  Home,
  Building2,
  Factory,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingCart,
  FileDown,
  MessageCircle,
  Share2,
  ArrowRight,
  Shield,
  Cable,
  Gauge,
  Monitor,
  Box,
  Wrench,
  TrendingUp,
  DollarSign,
  Clock,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

// ─── Constants ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: 'Company', icon: Building2 },
  { id: 2, title: 'Panels', icon: Sun },
  { id: 3, title: 'Inverter', icon: Zap },
  { id: 4, title: 'Battery', icon: Battery },
  { id: 5, title: 'Structure', icon: Home },
  { id: 6, title: 'Installation', icon: Wrench },
  { id: 7, title: 'Accessories', icon: Cable },
  { id: 8, title: 'Review', icon: Check },
];

const COMPANY_TYPES = [
  { value: 'residential', label: 'Residential', icon: Home, description: 'Homes & apartments' },
  { value: 'commercial', label: 'Commercial', icon: Building2, description: 'Offices & shops' },
  { value: 'industrial', label: 'Industrial', icon: Factory, description: 'Factories & warehouses' },
  { value: 'government', label: 'Government', icon: Landmark, description: 'Public institutions' },
];

const INVERTER_CAPACITIES = ['5kW', '10kW', '15kW', '20kW', '50kW'];

const STRUCTURE_TYPES = [
  { value: 'roof-mount', label: 'Roof Mount', icon: Home, description: 'On your rooftop' },
  { value: 'ground-mount', label: 'Ground Mount', icon: Building2, description: 'Open field installation' },
  { value: 'carport', label: 'Carport', icon: Factory, description: 'Solar carport structure' },
];

const ACCESSORY_OPTIONS = [
  { id: 'mc4', label: 'MC4 Connectors', price: 45 },
  { id: 'cable', label: 'Solar Cable (100m)', price: 120 },
  { id: 'isolator', label: 'DC Isolator', price: 35 },
  { id: 'spd', label: 'Surge Protection (SPD)', price: 65 },
  { id: 'monitoring', label: 'Monitoring System', price: 250 },
  { id: 'protection', label: 'Protection Box', price: 180 },
];

// ─── Data helpers ───────────────────────────────────────────────────────────

const panelProducts = solarProducts.filter((p) => p.subcategory === 'panels');
const inverterProducts = solarProducts.filter((p) => p.subcategory === 'inverters');
const batteryProducts = solarProducts.filter((p) => p.subcategory === 'batteries');

const panelBrands = [...new Set(panelProducts.map((p) => p.brand))];
const inverterBrands = [...new Set(inverterProducts.map((p) => p.brand))];
const batteryBrands = [...new Set(batteryProducts.map((p) => p.brand))];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SolarBuilderPage() {
  const navigate = useNavigationStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const [config, setConfig] = useState<SolarSystemConfig>({
    company: '',
    panelBrand: '',
    panelQuantity: 10,
    inverterBrand: '',
    inverterCapacity: '10kW',
    batteryBrand: '',
    batteryQuantity: 0,
    structureType: '',
    installation: false,
    accessories: [],
    protectionBox: false,
    monitoring: false,
  });

  const updateConfig = useCallback((updates: Partial<SolarSystemConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const goNext = useCallback(() => {
    if (currentStep < 8) {
      setDirection('forward');
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 1) {
      setDirection('backward');
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  // ─── Estimate calculations ──────────────────────────────────────────────

  const estimates = useMemo(() => {
    const selectedPanel = panelProducts.find((p) => p.brand === config.panelBrand);
    const panelPrice = selectedPanel?.price ?? 300;
    const selectedInverter = inverterProducts.find((p) => p.brand === config.inverterBrand);
    const inverterBasePrice = selectedInverter?.price ?? 1500;
    const inverterCapNum = parseFloat(config.inverterCapacity);
    const inverterPrice = inverterCapNum <= 5 ? inverterBasePrice * 0.7 : inverterCapNum <= 15 ? inverterBasePrice : inverterBasePrice * 2;
    const selectedBattery = batteryProducts.find((p) => p.brand === config.batteryBrand);
    const batteryPrice = selectedBattery?.price ?? 5000;

    const panelsCost = config.panelQuantity * panelPrice;
    const inverterCost = inverterPrice;
    const batteryCost = config.batteryQuantity * batteryPrice;
    const structureCost = config.structureType === 'ground-mount' ? config.panelQuantity * 60 : config.structureType === 'carport' ? config.panelQuantity * 90 : config.panelQuantity * 35;
    const installationCost = config.installation ? 2000 + config.panelQuantity * 50 : 0;
    const accessoriesCost = config.accessories.reduce((sum, accId) => {
      const acc = ACCESSORY_OPTIONS.find((a) => a.id === accId);
      return sum + (acc?.price ?? 0);
    }, 0);
    const protectionCost = config.protectionBox ? 180 : 0;
    const monitoringCost = config.monitoring ? 250 : 0;

    const totalCost = panelsCost + inverterCost + batteryCost + structureCost + installationCost + accessoriesCost + protectionCost + monitoringCost;

    const estimatedProduction = config.panelQuantity * 1500; // kWh/year
    const monthlySavings = estimatedProduction * 0.12 / 12;
    const paybackPeriod = monthlySavings > 0 ? totalCost / (monthlySavings * 12) : 0;

    const recommendedUpgrades: string[] = [];
    if (config.batteryQuantity === 0) recommendedUpgrades.push('Add battery storage for backup power and energy independence');
    if (config.panelQuantity < 10) recommendedUpgrades.push('Consider adding more panels for greater energy production');
    if (!config.monitoring) recommendedUpgrades.push('Add monitoring system to track performance in real-time');
    if (!config.installation) recommendedUpgrades.push('Professional installation ensures warranty coverage and safety');

    return {
      totalCost,
      estimatedProduction,
      monthlySavings,
      paybackPeriod,
      panelsCost,
      inverterCost,
      batteryCost,
      structureCost,
      installationCost,
      accessoriesCost,
      recommendedUpgrades,
    };
  }, [config]);

  const selectedPanel = useMemo(() => panelProducts.find((p) => p.brand === config.panelBrand), [config.panelBrand]);
  const panelPricePerUnit = selectedPanel?.price ?? 300;

  // ─── WhatsApp link ──────────────────────────────────────────────────────

  const whatsappMessage = encodeURIComponent(
    `Hi, I'd like a quote for a solar system:\n` +
    `- Company: ${config.company || 'Not selected'}\n` +
    `- Panels: ${config.panelQuantity}x ${config.panelBrand || 'Not selected'}\n` +
    `- Inverter: ${config.inverterBrand || 'Not selected'} ${config.inverterCapacity}\n` +
    `- Battery: ${config.batteryQuantity}x ${config.batteryBrand || 'None'}\n` +
    `- Structure: ${config.structureType || 'Not selected'}\n` +
    `- Installation: ${config.installation ? 'Yes' : 'No'}\n` +
    `- Estimated Cost: $${estimates.totalCost.toLocaleString()}\n` +
    `- Est. Production: ${estimates.estimatedProduction.toLocaleString()} kWh/year`
  );
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMessage}`;

  // ─── Step can proceed check ─────────────────────────────────────────────

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: return config.company !== '';
      case 2: return config.panelBrand !== '' && config.panelQuantity > 0;
      case 3: return config.inverterBrand !== '' && config.inverterCapacity !== '';
      case 4: return true; // battery is optional
      case 5: return config.structureType !== '';
      case 6: return true; // installation is toggle
      case 7: return true; // accessories are optional
      case 8: return true; // review step
      default: return true;
    }
  }, [currentStep, config]);

  // ─── Animation classes ──────────────────────────────────────────────────

  const slideClass = direction === 'forward'
    ? 'animate-in fade-in slide-in-from-right-4 duration-300'
    : 'animate-in fade-in slide-in-from-left-4 duration-300';

  // ─── Render step content ────────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">What type of company?</h2>
              <p className="text-gray-500 text-sm sm:text-base">Select your business type to customize the system</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {COMPANY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = config.company === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => updateConfig({ company: type.value })}
                    className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 size-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                    <div className={`flex size-14 items-center justify-center rounded-xl transition-colors ${
                      isSelected ? 'bg-amber-500' : 'bg-gray-100 group-hover:bg-amber-100'
                    }`}>
                      <Icon className={`size-7 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-amber-600'}`} />
                    </div>
                    <div className="text-center">
                      <p className={`font-bold text-lg ${isSelected ? 'text-amber-700' : 'text-gray-900'}`}>{type.label}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Solar Panels</h2>
              <p className="text-gray-500 text-sm sm:text-base">Choose your panel brand and quantity</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Brand selection */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Panel Brand</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {panelBrands.map((brand) => {
                    const brandProduct = panelProducts.find((p) => p.brand === brand);
                    const isSelected = config.panelBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => updateConfig({ panelBrand: brand })}
                        className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className={`flex size-12 items-center justify-center rounded-lg ${
                          isSelected ? 'bg-amber-500' : 'bg-gray-100'
                        }`}>
                          <Sun className={`size-6 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold ${isSelected ? 'text-amber-700' : 'text-gray-900'}`}>{brand}</p>
                          <p className="text-xs text-gray-500">{brandProduct?.power} · {brandProduct?.technology}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">${brandProduct?.price}</p>
                          <p className="text-xs text-gray-400">per panel</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity slider */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Number of Panels: <span className="text-amber-600 font-bold">{config.panelQuantity}</span>
                </Label>
                <Slider
                  value={[config.panelQuantity]}
                  onValueChange={(val) => updateConfig({ panelQuantity: val[0] })}
                  min={1}
                  max={100}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              {/* Price summary */}
              {config.panelBrand && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Panel cost estimate</p>
                      <p className="text-lg font-bold text-gray-900">
                        {config.panelQuantity} × ${panelPricePerUnit} = <span className="text-amber-600">${(config.panelQuantity * panelPricePerUnit).toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500">
                      <Sun className="size-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Inverter</h2>
              <p className="text-gray-500 text-sm sm:text-base">Choose inverter brand and capacity</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Brand */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Inverter Brand</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inverterBrands.map((brand) => {
                    const brandProduct = inverterProducts.find((p) => p.brand === brand);
                    const isSelected = config.inverterBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => updateConfig({ inverterBrand: brand })}
                        className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className={`flex size-12 items-center justify-center rounded-lg ${
                          isSelected ? 'bg-amber-500' : 'bg-gray-100'
                        }`}>
                          <Zap className={`size-6 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold ${isSelected ? 'text-amber-700' : 'text-gray-900'}`}>{brand}</p>
                          <p className="text-xs text-gray-500">{brandProduct?.technology} · {brandProduct?.power}</p>
                        </div>
                        <p className="font-bold text-amber-600">${brandProduct?.price?.toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capacity */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Inverter Capacity</Label>
                <div className="flex flex-wrap gap-3">
                  {INVERTER_CAPACITIES.map((cap) => {
                    const isSelected = config.inverterCapacity === cap;
                    return (
                      <button
                        key={cap}
                        onClick={() => updateConfig({ inverterCapacity: cap })}
                        className={`px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        {cap}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Battery Storage</h2>
              <p className="text-gray-500 text-sm sm:text-base">Add battery backup (optional)</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Brand */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Battery Brand</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => updateConfig({ batteryBrand: '', batteryQuantity: 0 })}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                      config.batteryBrand === ''
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className={`flex size-12 items-center justify-center rounded-lg ${
                      config.batteryBrand === '' ? 'bg-amber-500' : 'bg-gray-100'
                    }`}>
                      <Shield className={`size-6 ${config.batteryBrand === '' ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold ${config.batteryBrand === '' ? 'text-amber-700' : 'text-gray-900'}`}>No Battery</p>
                      <p className="text-xs text-gray-500">Grid-tied only, no backup</p>
                    </div>
                  </button>
                  {batteryBrands.map((brand) => {
                    const brandProduct = batteryProducts.find((p) => p.brand === brand);
                    const isSelected = config.batteryBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => updateConfig({ batteryBrand: brand, batteryQuantity: config.batteryQuantity || 1 })}
                        className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className={`flex size-12 items-center justify-center rounded-lg ${
                          isSelected ? 'bg-amber-500' : 'bg-gray-100'
                        }`}>
                          <Battery className={`size-6 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold ${isSelected ? 'text-amber-700' : 'text-gray-900'}`}>{brand}</p>
                          <p className="text-xs text-gray-500">{brandProduct?.capacity} · {brandProduct?.technology}</p>
                        </div>
                        <p className="font-bold text-amber-600">${brandProduct?.price?.toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              {config.batteryBrand && (
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Battery Quantity: <span className="text-amber-600 font-bold">{config.batteryQuantity}</span>
                  </Label>
                  <Slider
                    value={[config.batteryQuantity]}
                    onValueChange={(val) => updateConfig({ batteryQuantity: val[0] })}
                    min={1}
                    max={10}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Structure Type</h2>
              <p className="text-gray-500 text-sm sm:text-base">How will your panels be mounted?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {STRUCTURE_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = config.structureType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => updateConfig({ structureType: type.value })}
                    className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 size-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <Check className="size-4 text-white" />
                      </div>
                    )}
                    <div className={`flex size-14 items-center justify-center rounded-xl transition-colors ${
                      isSelected ? 'bg-amber-500' : 'bg-gray-100 group-hover:bg-amber-100'
                    }`}>
                      <Icon className={`size-7 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-amber-600'}`} />
                    </div>
                    <div className="text-center">
                      <p className={`font-bold ${isSelected ? 'text-amber-700' : 'text-gray-900'}`}>{type.label}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Installation</h2>
              <p className="text-gray-500 text-sm sm:text-base">Do you need professional installation?</p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className={`border-2 transition-all ${config.installation ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex size-14 items-center justify-center rounded-xl ${config.installation ? 'bg-amber-500' : 'bg-gray-100'}`}>
                        <Wrench className={`size-7 ${config.installation ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900">Professional Installation</p>
                        <p className="text-sm text-gray-500">Certified team, warranty included</p>
                        <p className="text-xs text-amber-600 font-medium mt-1">Starting from $2,000 + $50/panel</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.installation}
                      onCheckedChange={(checked) => updateConfig({ installation: checked })}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>
                </CardContent>
              </Card>
              <p className="text-center text-xs text-gray-400 mt-4">
                DIY installation is possible but professional installation ensures safety and warranty coverage.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Accessories</h2>
              <p className="text-gray-500 text-sm sm:text-base">Select additional components for your system</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {ACCESSORY_OPTIONS.map((acc) => {
                const isChecked = config.accessories.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      const newAccessories = isChecked
                        ? config.accessories.filter((a) => a !== acc.id)
                        : [...config.accessories, acc.id];
                      updateConfig({ accessories: newAccessories });
                    }}
                    className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 text-left ${
                      isChecked
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded-lg shrink-0 ${
                      isChecked ? 'bg-amber-500' : 'bg-gray-100'
                    }`}>
                      {isChecked ? (
                        <Check className="size-5 text-white" />
                      ) : (
                        <Box className="size-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isChecked ? 'text-amber-700' : 'text-gray-900'}`}>{acc.label}</p>
                    </div>
                    <p className={`font-bold ${isChecked ? 'text-amber-600' : 'text-gray-500'}`}>
                      ${acc.price}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 8:
        return (
          <div className={`space-y-6 ${slideClass}`}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Review & Estimate</h2>
              <p className="text-gray-500 text-sm sm:text-base">Your complete solar system configuration</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration Summary */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="size-5 text-amber-500" />
                      Configuration Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <SummaryRow label="Company Type" value={config.company || '—'} />
                    <Separator />
                    <SummaryRow label="Panel Brand" value={config.panelBrand || '—'} />
                    <SummaryRow label="Panel Quantity" value={`${config.panelQuantity} panels`} />
                    <SummaryRow label="Panel Cost" value={`$${estimates.panelsCost.toLocaleString()}`} highlight />
                    <Separator />
                    <SummaryRow label="Inverter Brand" value={config.inverterBrand || '—'} />
                    <SummaryRow label="Inverter Capacity" value={config.inverterCapacity} />
                    <SummaryRow label="Inverter Cost" value={`$${estimates.inverterCost.toLocaleString()}`} highlight />
                    <Separator />
                    <SummaryRow label="Battery Brand" value={config.batteryBrand || 'None'} />
                    <SummaryRow label="Battery Quantity" value={config.batteryQuantity > 0 ? `${config.batteryQuantity} units` : '0'} />
                    {config.batteryQuantity > 0 && (
                      <SummaryRow label="Battery Cost" value={`$${estimates.batteryCost.toLocaleString()}`} highlight />
                    )}
                    <Separator />
                    <SummaryRow label="Structure Type" value={config.structureType || '—'} />
                    <SummaryRow label="Structure Cost" value={`$${estimates.structureCost.toLocaleString()}`} highlight />
                    <Separator />
                    <SummaryRow label="Installation" value={config.installation ? 'Yes' : 'No'} />
                    {config.installation && (
                      <SummaryRow label="Installation Cost" value={`$${estimates.installationCost.toLocaleString()}`} highlight />
                    )}
                    {config.accessories.length > 0 && (
                      <>
                        <Separator />
                        <SummaryRow label="Accessories" value={config.accessories.map((id) => ACCESSORY_OPTIONS.find((a) => a.id === id)?.label).join(', ')} />
                        <SummaryRow label="Accessories Cost" value={`$${estimates.accessoriesCost.toLocaleString()}`} highlight />
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Estimate Results */}
                <div className="space-y-4">
                  <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="size-5 text-amber-500" />
                        System Estimate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <EstimateCard
                          icon={Sun}
                          label="Est. Production"
                          value={`${estimates.estimatedProduction.toLocaleString()} kWh/yr`}
                          color="text-amber-600"
                        />
                        <EstimateCard
                          icon={DollarSign}
                          label="Total Cost"
                          value={`$${estimates.totalCost.toLocaleString()}`}
                          color="text-gray-900"
                        />
                        <EstimateCard
                          icon={TrendingUp}
                          label="Monthly Savings"
                          value={`$${estimates.monthlySavings.toFixed(0)}`}
                          color="text-emerald-600"
                        />
                        <EstimateCard
                          icon={Clock}
                          label="Payback Period"
                          value={`${estimates.paybackPeriod.toFixed(1)} years`}
                          color="text-blue-600"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Upgrades */}
                  {estimates.recommendedUpgrades.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                          <Lightbulb className="size-4 text-blue-500" />
                          Recommended Upgrades
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {estimates.recommendedUpgrades.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                              <ArrowRight className="size-4 mt-0.5 shrink-0 text-blue-400" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
                      onClick={() => {
                        // Add a representative product to cart
                        const systemProduct = solarProducts.find((p) => p.subcategory === 'complete-systems');
                        if (systemProduct) addItem(systemProduct);
                      }}
                    >
                      <ShoppingCart className="size-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="border-amber-500 text-amber-600 hover:bg-amber-50 font-bold"
                    >
                      <FileDown className="size-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white font-bold"
                      asChild
                    >
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="size-4 mr-2" />
                        Get Quote
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold"
                      asChild
                    >
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Share2 className="size-4 mr-2" />
                        Share
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <button onClick={() => navigate('home')} className="hover:text-amber-600 transition-colors">Home</button>
            <ChevronRight className="size-4" />
            <button onClick={() => navigate('solar')} className="hover:text-amber-600 transition-colors">Solar</button>
            <ChevronRight className="size-4" />
            <span className="text-gray-900 font-medium">Solar Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Solar System Builder</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your perfect solar system step by step</p>
        </div>

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center min-w-max gap-1 pb-2">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => {
                      if (isCompleted) {
                        setDirection(currentStep > step.id ? 'backward' : 'forward');
                        setCurrentStep(step.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                        : isCompleted
                        ? 'bg-amber-100 text-amber-700 cursor-pointer hover:bg-amber-200'
                        : 'bg-gray-100 text-gray-400 cursor-default'
                    }`}
                  >
                    <div className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20' : isCompleted ? 'bg-amber-200' : 'bg-gray-200'
                    }`}>
                      {isCompleted ? <Check className="size-4" /> : step.id}
                    </div>
                    <span className="text-sm font-semibold hidden sm:inline">{step.title}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-0.5 w-4 sm:w-8 rounded transition-colors ${
                      currentStep > step.id ? 'bg-amber-400' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentStep === 1}
            className="border-gray-300"
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm text-gray-400">
            Step {currentStep} of 8
          </span>

          {currentStep < 8 ? (
            <Button
              onClick={goNext}
              disabled={!canProceed}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate('solar-calculator')}
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              Try Calculator
              <ArrowRight className="size-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-amber-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

function EstimateCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <Icon className={`size-6 mx-auto mb-2 ${color}`} />
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
