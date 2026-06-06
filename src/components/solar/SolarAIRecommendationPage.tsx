'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useNavigationStore, useCartStore } from '@/lib/store';
import { solarProducts } from '@/lib/data';
import type { SolarAIRecommendation } from '@/lib/types';
import {
  Sun,
  Zap,
  Battery,
  ChevronRight,
  Sparkles,
  ShoppingCart,
  FileDown,
  MessageCircle,
  Construction,
  DollarSign,
  TrendingUp,
  Clock,
  Check,
  Box,
  Cable,
  Shield,
  Monitor,
  Gauge,
  Snowflake,
  Refrigerator,
  WashingMachine,
  Tv,
  Lightbulb,
  Flame,
  Shirt,
  Microwave,
  Computer,
  CookingPot,
  Package,
  Leaf,
  Bot,
  ArrowRight,
  Star,
  Cpu,
} from 'lucide-react';

// ─── Appliance Data ─────────────────────────────────────────────────────────

const APPLIANCE_CHIPS = [
  { id: 'ac', label: 'Air Conditioner', icon: Snowflake, watts: 2000 },
  { id: 'fridge', label: 'Refrigerator', icon: Refrigerator, watts: 200 },
  { id: 'washing', label: 'Washing Machine', icon: WashingMachine, watts: 500 },
  { id: 'tv', label: 'TV', icon: Tv, watts: 150 },
  { id: 'lights', label: 'Lights', icon: Lightbulb, watts: 300 },
  { id: 'heater', label: 'Water Heater', icon: Flame, watts: 1500 },
  { id: 'iron', label: 'Iron', icon: Shirt, watts: 1000 },
  { id: 'microwave', label: 'Microwave', icon: Microwave, watts: 1200 },
  { id: 'computer', label: 'Computer', icon: Computer, watts: 300 },
  { id: 'oven', label: 'Oven', icon: CookingPot, watts: 2000 },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SolarAIRecommendationPage() {
  const navigate = useNavigationStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);

  const [monthlyBill, setMonthlyBill] = useState('');
  const [houseSize, setHouseSize] = useState('');
  const [backupRequired, setBackupRequired] = useState(false);
  const [budget, setBudget] = useState<[number, number]>([5000, 30000]);
  const [location, setLocation] = useState('');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<SolarAIRecommendation | null>(null);
  const [showResult, setShowResult] = useState(false);

  const toggleAppliance = useCallback((id: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  // ─── Generate AI Recommendation ─────────────────────────────────────────

  const generateRecommendation = useCallback(() => {
    const bill = parseFloat(monthlyBill) || 0;
    if (bill <= 0) return;

    setIsLoading(true);
    setShowResult(false);

    // Simulate AI processing delay
    setTimeout(() => {
      // Determine system size based on bill
      let systemSize: number;
      let inverterRec: string;
      let inverterCapacity: string;

      if (bill > 200) {
        systemSize = 10 + (bill - 200) / 50;
        inverterCapacity = '10kW+';
        inverterRec = 'Huawei SUN2000-10KTL-M2';
      } else if (bill >= 100) {
        systemSize = 5 + (bill - 100) / 20;
        inverterCapacity = '5-10kW';
        inverterRec = 'Growatt MIN 10000TL-XH';
      } else {
        systemSize = 3 + bill / 50;
        inverterCapacity = '3-5kW';
        inverterRec = 'Huawei SUN2000-5KTL';
      }

      // Add appliance load
      const applianceLoad = selectedAppliances.reduce((sum, id) => {
        const app = APPLIANCE_CHIPS.find((a) => a.id === id);
        return sum + (app?.watts ?? 0);
      }, 0);
      const peakLoadKW = applianceLoad / 1000;
      if (peakLoadKW > systemSize) {
        systemSize = peakLoadKW * 1.2;
      }

      const panels = Math.ceil(systemSize / 0.44);
      const panelName = systemSize > 8 ? 'Jinko Tiger Neo 580W' : 'Trina Solar Vertex S+ 440W';
      const panelWattage = systemSize > 8 ? 580 : 440;
      const totalWattage = panels * panelWattage;

      // Battery
      let batteryName = 'None required';
      let batteryCapacity = '';
      if (backupRequired) {
        if (systemSize > 10) {
          batteryName = 'BYD Battery-Box Premium HVM 22.1kWh';
          batteryCapacity = '22.1 kWh';
        } else if (systemSize > 5) {
          batteryName = 'Tesla Powerwall 3';
          batteryCapacity = '13.5 kWh';
        } else {
          batteryName = 'Pylontech Force H2 7.1kWh';
          batteryCapacity = '7.1 kWh';
        }
      }

      // Accessories
      const accessories: string[] = [
        'MC4 Solar Connectors',
        'Solar Cable 6mm² (100m)',
        'DC Isolator Switch',
        'Surge Protection Device',
      ];
      if (systemSize > 10) accessories.push('Combiner Box');
      if (backupRequired) accessories.push('Battery Management System');

      // Cost
      const panelPrice = systemSize > 8 ? 395 : 285;
      const panelsCost = panels * panelPrice;
      const inverterCost = systemSize > 10 ? 1450 * 2 : 1450;
      const batteryCost = backupRequired
        ? (systemSize > 10 ? 7200 : systemSize > 5 ? 8500 : 3100)
        : 0;
      const accessoriesCost = 300 + (systemSize > 10 ? 200 : 0);
      const installationCost = 2000;
      const totalCost = panelsCost + inverterCost + batteryCost + accessoriesCost + installationCost;

      const monthlySavings = systemSize * 150 * 0.12;
      const paybackPeriod = monthlySavings > 0 ? totalCost / (monthlySavings * 12) : 0;

      setRecommendation({
        panels: `${panels} × ${panelName} (${totalWattage.toLocaleString()}W total)`,
        inverter: `${inverterRec} (${inverterCapacity})`,
        battery: batteryName + (batteryCapacity ? ` — ${batteryCapacity}` : ''),
        accessories,
        estimatedCost: `$${totalCost.toLocaleString()}`,
        estimatedSavings: `$${monthlySavings.toFixed(0)}/month`,
        paybackPeriod: `${paybackPeriod.toFixed(1)} years`,
      });

      setIsLoading(false);
      setShowResult(true);
    }, 2000);
  }, [monthlyBill, selectedAppliances, backupRequired]);

  // ─── WhatsApp link ──────────────────────────────────────────────────────

  const whatsappMessage = recommendation
    ? encodeURIComponent(
        `Hi, I got an AI solar recommendation and would like a quote:\n` +
        `- Monthly Bill: $${monthlyBill}\n` +
        `- Panels: ${recommendation.panels}\n` +
        `- Inverter: ${recommendation.inverter}\n` +
        `- Battery: ${recommendation.battery}\n` +
        `- Est. Cost: ${recommendation.estimatedCost}\n` +
        `- Est. Savings: ${recommendation.estimatedSavings}\n` +
        `- Payback: ${recommendation.paybackPeriod}`
      )
    : '';
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMessage}`;

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
            <span className="text-gray-900 font-medium">AI Recommendation</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              <Bot className="size-6 text-white" />
              <div className="absolute -top-1 -right-1 size-4 rounded-full bg-green-500 border-2 border-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">AI Solar Recommendation</h1>
              <p className="text-gray-500 text-sm">Tell us your needs — our AI designs the perfect system</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="size-5 text-amber-500" />
                  Your Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                {/* Monthly Bill */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Monthly Electricity Bill ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g. 150"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                {/* House Size */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">House Size (sq ft)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 2000"
                    value={houseSize}
                    onChange={(e) => setHouseSize(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Location</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Lahore, Pakistan"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Budget Range */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Budget: <span className="text-amber-600">${budget[0].toLocaleString()} — ${budget[1].toLocaleString()}</span>
                  </Label>
                  <Slider
                    value={budget}
                    onValueChange={(val) => setBudget(val as [number, number])}
                    min={1000}
                    max={100000}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>$1,000</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Battery Backup Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Battery className="size-5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Battery Backup Required?</p>
                      <p className="text-xs text-gray-500">For power outage protection</p>
                    </div>
                  </div>
                  <Switch
                    checked={backupRequired}
                    onCheckedChange={setBackupRequired}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>

                {/* Appliances - Chips */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Appliances</Label>
                  <div className="flex flex-wrap gap-2">
                    {APPLIANCE_CHIPS.map((app) => {
                      const Icon = app.icon;
                      const isSelected = selectedAppliances.includes(app.id);
                      return (
                        <button
                          key={app.id}
                          onClick={() => toggleAppliance(app.id)}
                          className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                          }`}
                        >
                          <Icon className="size-3.5" />
                          {app.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Button */}
                <Button
                  onClick={generateRecommendation}
                  disabled={!monthlyBill || parseFloat(monthlyBill) <= 0 || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-base disabled:opacity-50 shadow-lg shadow-amber-500/25 transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>AI is analyzing your needs...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="size-5 mr-2" />
                      Get AI Recommendation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {!showResult || !recommendation ? (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="p-12 text-center">
                  {isLoading ? (
                    <>
                      <div className="relative flex size-24 items-center justify-center mx-auto mb-6">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse" />
                        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
                          <Cpu className="size-10 text-white animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">AI is Working...</h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Our AI is analyzing your energy profile, location data, and appliance usage to design the optimal solar system for you.
                      </p>
                      <div className="flex justify-center gap-1 mt-4">
                        <div className="size-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0ms]" />
                        <div className="size-2 rounded-full bg-amber-500 animate-bounce [animation-delay:150ms]" />
                        <div className="size-2 rounded-full bg-amber-500 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mx-auto mb-4">
                        <Bot className="size-10 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Design Your System</h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Enter your electricity bill and preferences, then let our AI create a personalized solar recommendation
                      </p>
                      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Zap className="size-3.5" />
                          Smart Sizing
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="size-3.5" />
                          Cost Optimized
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Leaf className="size-3.5" />
                          Eco Friendly
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {/* 3D-style Visual System Card */}
                <Card className="border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden shadow-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-green-500 text-white border-0 font-bold text-xs">
                        <div className="size-2 rounded-full bg-white mr-1.5 animate-pulse" />
                        AI RECOMMENDED
                      </Badge>
                      <Badge className="bg-amber-500 text-black border-0 font-bold text-xs">
                        <Sparkles className="size-3 mr-1" />
                        OPTIMIZED
                      </Badge>
                    </div>

                    {/* 3D System Layout Visualization */}
                    <div className="relative mb-6">
                      <div className="grid grid-cols-3 gap-3">
                        {/* Panels */}
                        <div className="col-span-2 rounded-xl bg-gradient-to-br from-blue-900/60 to-blue-800/40 border border-blue-500/20 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Sun className="size-5 text-amber-400" />
                            <span className="text-sm font-bold text-white">Solar Panels</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={i}
                                className="aspect-[4/3] rounded bg-gradient-to-br from-blue-400/30 to-blue-600/30 border border-blue-400/20 flex items-center justify-center"
                              >
                                <div className="w-[60%] h-[1px] bg-blue-400/40" />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-blue-300 mt-2 font-medium">{recommendation.panels}</p>
                        </div>

                        {/* Battery */}
                        {backupRequired && (
                          <div className="rounded-xl bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 border border-emerald-500/20 p-4 flex flex-col items-center justify-center">
                            <Battery className="size-8 text-emerald-400 mb-2" />
                            <span className="text-xs font-bold text-emerald-300 text-center">Battery</span>
                            <span className="text-[10px] text-emerald-400/70 mt-1 text-center">
                              {recommendation.battery.split('—')[1]?.trim() || 'Storage'}
                            </span>
                            <div className="w-full mt-2 h-2 rounded-full bg-emerald-900 overflow-hidden">
                              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse" />
                            </div>
                          </div>
                        )}

                        {/* Inverter */}
                        <div className="rounded-xl bg-gradient-to-br from-amber-900/60 to-amber-800/40 border border-amber-500/20 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="size-5 text-amber-400" />
                            <span className="text-xs font-bold text-amber-300">Inverter</span>
                          </div>
                          <p className="text-[10px] text-amber-400/70">{recommendation.inverter}</p>
                        </div>

                        {/* Accessories */}
                        <div className="col-span-2 rounded-xl bg-gradient-to-br from-purple-900/60 to-purple-800/40 border border-purple-500/20 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Box className="size-4 text-purple-400" />
                            <span className="text-xs font-bold text-purple-300">Accessories</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {recommendation.accessories.map((acc, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20"
                              >
                                {acc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Connection lines */}
                      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                        <line x1="50%" y1="30%" x2="30%" y2="70%" stroke="rgba(251,191,36,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="50%" y1="30%" x2="70%" y2="70%" stroke="rgba(251,191,36,0.3)" strokeWidth="1" strokeDasharray="4 4" />
                      </svg>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                        <DollarSign className="size-5 text-amber-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Total Cost</p>
                        <p className="text-lg font-bold text-white">{recommendation.estimatedCost}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                        <TrendingUp className="size-5 text-emerald-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Monthly Savings</p>
                        <p className="text-lg font-bold text-emerald-400">{recommendation.estimatedSavings}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                        <Clock className="size-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Payback</p>
                        <p className="text-lg font-bold text-blue-400">{recommendation.paybackPeriod}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Recommendation */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Star className="size-5 text-amber-500" />
                      AI Recommendation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <RecDetail
                      icon={Sun}
                      label="Recommended Panels"
                      value={recommendation.panels}
                      color="text-amber-600"
                      bgColor="bg-amber-100"
                    />
                    <RecDetail
                      icon={Zap}
                      label="Recommended Inverter"
                      value={recommendation.inverter}
                      color="text-blue-600"
                      bgColor="bg-blue-100"
                    />
                    <RecDetail
                      icon={Battery}
                      label="Recommended Battery"
                      value={recommendation.battery}
                      color="text-emerald-600"
                      bgColor="bg-emerald-100"
                    />
                    <Separator />
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Required Accessories</Label>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.accessories.map((acc, i) => {
                          const icons = [Cable, Shield, Gauge, Monitor, Box, Package];
                          const Icon = icons[i % icons.length];
                          return (
                            <Badge key={i} variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3">
                              <Icon className="size-3.5 text-amber-600" />
                              {acc}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold"
                    onClick={() => {
                      // Add recommended products to cart
                      const panelProduct = solarProducts.find((p) => p.subcategory === 'panels');
                      const inverterProduct = solarProducts.find((p) => p.subcategory === 'inverters');
                      if (panelProduct) addItem(panelProduct);
                      if (inverterProduct) addItem(inverterProduct);
                      if (backupRequired) {
                        const batteryProduct = solarProducts.find((p) => p.subcategory === 'batteries');
                        if (batteryProduct) addItem(batteryProduct);
                      }
                    }}
                  >
                    <ShoppingCart className="size-4 mr-2" />
                    Add All to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-gray-300 font-bold"
                  >
                    <FileDown className="size-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
                    asChild
                  >
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4 mr-2" />
                      Get Quote
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-amber-500 text-amber-600 hover:bg-amber-50 font-bold"
                    onClick={() => navigate('solar-builder')}
                  >
                    <Construction className="size-4 mr-2" />
                    Configure Manually
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function RecDetail({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
      <div className={`flex size-10 items-center justify-center rounded-lg ${bgColor} shrink-0`}>
        <Icon className={`size-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`font-semibold text-sm ${color} break-words`}>{value}</p>
      </div>
    </div>
  );
}
