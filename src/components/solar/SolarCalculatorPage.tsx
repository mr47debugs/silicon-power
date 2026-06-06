'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useNavigationStore, useCartStore } from '@/lib/store';
import { solarProducts } from '@/lib/data';
import {
  Sun,
  Zap,
  Battery,
  Calculator,
  ChevronRight,
  Home,
  DollarSign,
  TrendingUp,
  Clock,
  Leaf,
  ArrowRight,
  MessageCircle,
  Check,
  Snowflake,
  Refrigerator,
  WashingMachine,
  Tv,
  Lightbulb,
  Flame,
  Shirt,
  Microwave,
  Construction,
} from 'lucide-react';

// ─── Appliance Data ─────────────────────────────────────────────────────────

const APPLIANCES = [
  { id: 'ac', label: 'Air Conditioner', icon: Snowflake, watts: 2000 },
  { id: 'fridge', label: 'Fridge', icon: Refrigerator, watts: 200 },
  { id: 'washing', label: 'Washing Machine', icon: WashingMachine, watts: 500 },
  { id: 'tv', label: 'TV', icon: Tv, watts: 150 },
  { id: 'lights', label: 'Lights', icon: Lightbulb, watts: 300 },
  { id: 'heater', label: 'Water Heater', icon: Flame, watts: 1500 },
  { id: 'iron', label: 'Iron', icon: Shirt, watts: 1000 },
  { id: 'microwave', label: 'Microwave', icon: Microwave, watts: 1200 },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SolarCalculatorPage() {
  const navigate = useNavigationStore((s) => s.navigate);
  const addItem = useCartStore((s) => s.addItem);

  const [monthlyBill, setMonthlyBill] = useState('');
  const [houseSize, setHouseSize] = useState('');
  const [location, setLocation] = useState('');
  const [batteryBackup, setBatteryBackup] = useState(false);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [calculated, setCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const toggleAppliance = (id: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // ─── Calculations ───────────────────────────────────────────────────────

  const results = useMemo(() => {
    const bill = parseFloat(monthlyBill) || 0;
    if (bill <= 0) return null;

    // System size = (monthly bill / 0.12) / 150 hours
    const systemSize = (bill / 0.12) / 150;
    // Panels = system size / 0.44 kW per panel, rounded up
    const panels = Math.ceil(systemSize / 0.44);
    // Battery = system size × 1.5 kWh if backup needed
    const batteryCapacity = batteryBackup ? systemSize * 1.5 : 0;
    // Inverter size (match system size, round to nearest standard)
    const inverterSize = Math.ceil(systemSize / 5) * 5;
    if (inverterSize <= 0) return null;
    // Cost = panels × $300 + inverter × $1500 + battery × $500/kWh + $2000 installation
    const panelsCost = panels * 300;
    const inverterCost = inverterSize <= 5 ? 1500 : inverterSize <= 10 ? 1500 * 1.5 : inverterSize <= 15 ? 1500 * 2 : 1500 * 3;
    const batteryCost = batteryCapacity * 500;
    const installationCost = 2000;
    const totalCost = panelsCost + inverterCost + batteryCost + installationCost;
    // Savings = system size × 150 hours × $0.12
    const monthlySavings = systemSize * 150 * 0.12;
    // Payback = cost / (savings × 12)
    const paybackPeriod = monthlySavings > 0 ? totalCost / (monthlySavings * 12) : 0;
    // CO2 savings: ~0.42 kg CO2 per kWh
    const annualProduction = systemSize * 150 * 12;
    const annualCO2Savings = annualProduction * 0.42;

    return {
      systemSize,
      panels,
      batteryCapacity,
      inverterSize,
      totalCost,
      monthlySavings,
      paybackPeriod,
      annualProduction,
      annualCO2Savings,
      panelsCost,
      inverterCost,
      batteryCost,
      installationCost,
    };
  }, [monthlyBill, batteryBackup, selectedAppliances]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setCalculated(true);
      setIsCalculating(false);
    }, 800);
  };

  // ─── WhatsApp link ──────────────────────────────────────────────────────

  const whatsappMessage = results
    ? encodeURIComponent(
        `Hi, I'd like a quote based on my solar calculation:\n` +
        `- Monthly Bill: $${monthlyBill}\n` +
        `- House Size: ${houseSize || 'N/A'} sqft\n` +
        `- Location: ${location || 'N/A'}\n` +
        `- Recommended System: ${results.systemSize.toFixed(1)} kW\n` +
        `- Panels: ${results.panels}\n` +
        `- Est. Cost: $${results.totalCost.toLocaleString()}\n` +
        `- Monthly Savings: $${results.monthlySavings.toFixed(0)}`
      )
    : '';
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMessage}`;

  // ─── Savings gauge value (0-100%) ───────────────────────────────────────

  const savingsPercentage = results
    ? Math.min(Math.round((results.monthlySavings / (parseFloat(monthlyBill) || 1)) * 100), 100)
    : 0;

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
            <span className="text-gray-900 font-medium">Calculator</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500">
              <Calculator className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Solar Savings Calculator</h1>
              <p className="text-gray-500 text-sm">Estimate your savings and ROI from going solar</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Your Energy Details</CardTitle>
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
                      onChange={(e) => { setMonthlyBill(e.target.value); setCalculated(false); }}
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

                {/* Battery Backup Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Battery className="size-5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Battery Backup?</p>
                      <p className="text-xs text-gray-500">For power outage protection</p>
                    </div>
                  </div>
                  <Switch
                    checked={batteryBackup}
                    onCheckedChange={(checked) => { setBatteryBackup(checked); setCalculated(false); }}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>

                {/* Appliances */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Appliances</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {APPLIANCES.map((app) => {
                      const Icon = app.icon;
                      const isSelected = selectedAppliances.includes(app.id);
                      return (
                        <button
                          key={app.id}
                          onClick={() => toggleAppliance(app.id)}
                          className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-gray-200 bg-white hover:border-amber-300'
                          }`}
                        >
                          <Icon className={`size-4 ${isSelected ? 'text-amber-600' : 'text-gray-400'}`} />
                          <span className={`text-xs font-medium ${isSelected ? 'text-amber-700' : 'text-gray-600'}`}>
                            {app.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={handleCalculate}
                  disabled={!monthlyBill || parseFloat(monthlyBill) <= 0 || isCalculating}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base disabled:opacity-50"
                >
                  {isCalculating ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Calculating...
                    </div>
                  ) : (
                    <>
                      <Calculator className="size-5 mr-2" />
                      Calculate Savings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {!calculated || !results ? (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="p-12 text-center">
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-amber-100 mx-auto mb-4">
                    <Sun className="size-10 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Details</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Fill in your electricity bill and preferences to see your personalized solar savings estimate
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Savings Gauge */}
                <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Badge className="bg-amber-500 text-black border-0 font-bold mb-3">YOUR ESTIMATED SAVINGS</Badge>
                      <p className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        ${results.monthlySavings.toFixed(0)}<span className="text-lg text-gray-500 font-normal">/month</span>
                      </p>
                    </div>

                    {/* Gauge visualization */}
                    <div className="relative max-w-xs mx-auto mb-6">
                      <div className="relative h-8 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-out"
                          style={{ width: `${savingsPercentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-800 drop-shadow-sm">
                            {savingsPercentage}% of bill offset
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">{results.systemSize.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">kW System</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">${results.totalCost.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Est. Cost</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{results.paybackPeriod.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">Years Payback</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-gray-900">Detailed Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <ResultItem
                        icon={Sun}
                        label="Recommended System"
                        value={`${results.systemSize.toFixed(1)} kW`}
                        color="text-amber-600"
                        bgColor="bg-amber-100"
                      />
                      <ResultItem
                        icon={Sun}
                        label="Number of Panels"
                        value={`${results.panels} panels`}
                        color="text-amber-600"
                        bgColor="bg-amber-100"
                      />
                      <ResultItem
                        icon={Zap}
                        label="Inverter Size"
                        value={`${results.inverterSize} kW`}
                        color="text-blue-600"
                        bgColor="bg-blue-100"
                      />
                      {batteryBackup && (
                        <ResultItem
                          icon={Battery}
                          label="Battery Capacity"
                          value={`${results.batteryCapacity.toFixed(1)} kWh`}
                          color="text-emerald-600"
                          bgColor="bg-emerald-100"
                        />
                      )}
                      <ResultItem
                        icon={TrendingUp}
                        label="Monthly Savings"
                        value={`$${results.monthlySavings.toFixed(0)}`}
                        color="text-emerald-600"
                        bgColor="bg-emerald-100"
                      />
                      <ResultItem
                        icon={Clock}
                        label="Payback Period"
                        value={`${results.paybackPeriod.toFixed(1)} years`}
                        color="text-blue-600"
                        bgColor="bg-blue-100"
                      />
                    </div>

                    <Separator />

                    {/* Cost Breakdown */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown</p>
                      <div className="space-y-2">
                        <CostRow label={`Panels (${results.panels} × $300)`} value={results.panelsCost} />
                        <CostRow label={`Inverter (${results.inverterSize}kW)`} value={results.inverterCost} />
                        {batteryBackup && (
                          <CostRow label={`Battery (${results.batteryCapacity.toFixed(1)} kWh)`} value={results.batteryCost} />
                        )}
                        <CostRow label="Installation" value={results.installationCost} />
                        <Separator />
                        <div className="flex items-center justify-between font-bold text-lg">
                          <span className="text-gray-900">Total Estimated Cost</span>
                          <span className="text-amber-600">${results.totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* CO2 Savings */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500 shrink-0">
                        <Leaf className="size-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-800">Annual CO₂ Savings</p>
                        <p className="text-sm text-emerald-600">
                          {results.annualCO2Savings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} kg CO₂/year
                        </p>
                        <p className="text-xs text-emerald-500 mt-0.5">
                          Equivalent to planting {Math.round(results.annualCO2Savings / 21)} trees
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold"
                    onClick={() => navigate('solar-builder')}
                  >
                    <Construction className="size-5 mr-2" />
                    Build This System
                  </Button>
                  <Button
                    size="lg"
                    className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
                    asChild
                  >
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-5 mr-2" />
                      Get Quote via WhatsApp
                    </a>
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

function ResultItem({
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
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
      <div className={`flex size-10 items-center justify-center rounded-lg ${bgColor} shrink-0`}>
        <Icon className={`size-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`font-bold text-sm ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">${value.toLocaleString()}</span>
    </div>
  );
}
