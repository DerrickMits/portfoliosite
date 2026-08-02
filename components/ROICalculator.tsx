"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Users, Clock, DollarSign, TrendingUp, Target, Zap } from "lucide-react";

type EfficiencyTier = "conservative" | "target" | "aggressive";

const TIER_OPTIONS: { value: EfficiencyTier; label: string; icon: React.ReactNode; gain: number }[] = [
  { value: "conservative", label: "Conservative", icon: <Target className="w-4 h-4" />, gain: 0.20 },
  { value: "target", label: "Target Benchmark", icon: <TrendingUp className="w-4 h-4" />, gain: 0.35 },
  { value: "aggressive", label: "Aggressive", icon: <Zap className="w-4 h-4" />, gain: 0.50 },
];

interface SliderConfig {
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
  label: string;
  icon: React.ElementType;
  prefix?: string;
}

const SLIDER_CONFIG: Record<"teamSize" | "weeklyHours" | "hourlyRate", SliderConfig> = {
  teamSize: { min: 1, max: 50, default: 5, step: 1, unit: "", label: "Team Size", icon: Users },
  weeklyHours: { min: 2, max: 30, default: 10, step: 1, unit: " hrs", label: "Weekly Manual / Admin Hours per Person", icon: Clock },
  hourlyRate: { min: 15, max: 150, default: 45, step: 5, unit: "/hr", label: "Average Hourly Rate", icon: DollarSign, prefix: "$" },
};

type SliderKey = keyof typeof SLIDER_CONFIG;

function formatNumber(num: number): string {
  return Math.round(num).toLocaleString();
}

function formatCurrency(num: number): string {
  return "$" + Math.round(num).toLocaleString();
}

export function ROICalculator() {
  const [teamSize, setTeamSize] = useState(SLIDER_CONFIG.teamSize.default);
  const [weeklyHours, setWeeklyHours] = useState(SLIDER_CONFIG.weeklyHours.default);
  const [hourlyRate, setHourlyRate] = useState(SLIDER_CONFIG.hourlyRate.default);
  const [selectedTier, setSelectedTier] = useState<EfficiencyTier>("target");

  const tierConfig = TIER_OPTIONS.find(t => t.value === selectedTier)!;
  const efficiencyGain = tierConfig.gain;

  const calculations = useMemo(() => {
    const weeklyHoursTotal = teamSize * weeklyHours;
    const weeklyHoursSaved = weeklyHoursTotal * efficiencyGain;
    const annualHoursRecovered = weeklyHoursSaved * 52;
    const projectedCostSavings = annualHoursRecovered * hourlyRate;
    const equivalentFTE = weeklyHoursSaved / 40;

    return {
      weeklyHoursTotal,
      weeklyHoursSaved,
      annualHoursRecovered,
      projectedCostSavings,
      equivalentFTE,
    };
  }, [teamSize, weeklyHours, hourlyRate, efficiencyGain]);

  const createSlider = (key: SliderKey) => {
    const config = SLIDER_CONFIG[key];
    const Icon = config.icon;
    const value = key === "teamSize" ? teamSize : key === "weeklyHours" ? weeklyHours : hourlyRate;
    const setter = key === "teamSize" ? setTeamSize : key === "weeklyHours" ? setWeeklyHours : setHourlyRate;
    const prefix = config.prefix ?? "";
    const unit = config.unit;

    return (
      <div className="space-y-3" key={key}>
        <div className="flex items-center gap-2 text-warm-700">
          <Icon className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
          <span className="font-medium text-base">{config.label}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            onChange={(e) => setter(Number(e.target.value))}
            className="w-full h-2 bg-grey-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-grey-50 transition-all duration-200"
            aria-label={config.label}
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 flex justify-between text-xs text-grey-500 font-mono">
            <span>{config.prefix ?? ""}{config.min}{config.unit}</span>
            <span>{config.prefix ?? ""}{config.max}{config.unit}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-500 text-sm">Current value:</span>
          <span className="px-3 py-1 bg-grey-100 border border-grey-200 rounded-full text-amber-700 font-mono font-semibold text-base transition-all duration-200">
            {prefix}{formatNumber(value)}{unit}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 rounded-3xl blur-3xl pointer-events-none" aria-hidden="true" />
      
      {/* Main Card */}
      <div className="relative rounded-2xl border border-grey-200 bg-white/80 backdrop-blur-md p-6 sm:p-8 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            Operational Efficiency & ROI Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-warm-900 tracking-tight">
            Calculate Your Team's <span className="text-amber-600">Recovered Capacity</span>
          </h2>
          <p className="mt-2 text-grey-600 text-lg max-w-2xl mx-auto">
            Adjust the inputs to see how much time and money your organization could save with operational improvements.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Controls */}
          <div className="space-y-6">
            {createSlider("teamSize")}
            {createSlider("weeklyHours")}
            {createSlider("hourlyRate")}

            {/* Efficiency Gain Tier Selector */}
            <div className="space-y-3 pt-2 border-t border-grey-200">
              <div className="flex items-center gap-2 text-warm-700">
                <Target className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                <span className="font-medium text-base">Efficiency Gain Tier</span>
              </div>
              <div className="flex gap-2 p-1 bg-grey-100 rounded-xl" role="radiogroup" aria-label="Efficiency gain tier">
                {TIER_OPTIONS.map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    role="radio"
                    aria-checked={selectedTier === tier.value}
                    onClick={() => setSelectedTier(tier.value)}
                    className={`relative flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-out ${
                      selectedTier === tier.value
                        ? "bg-amber-100 text-amber-700 shadow-lg shadow-amber-200/50"
                        : "text-grey-600 hover:text-warm-900 hover:bg-grey-200"
                    }`}
                  >
                    <span className="text-amber-600 shrink-0" aria-hidden="true">
                      {tier.icon}
                    </span>
                    <span>{tier.label}</span>
                    <span className="ml-auto px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-grey-200 text-amber-700">
                      +{Math.round(tier.gain * 100)}%
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-grey-500 text-sm text-center">
                Selected: <span className="text-amber-700 font-medium">{tierConfig.label}</span> ({Math.round(efficiencyGain * 100)}% efficiency gain)
              </p>
            </div>
          </div>

          {/* Right Column - Dynamic Output Panel */}
          <div className="relative rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 via-white/90 to-orange-50/50 p-6 sm:p-8 backdrop-blur-md overflow-hidden">
            {/* Subtle glow border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-transparent to-orange-100/50 pointer-events-none" aria-hidden="true" />
            
            <div className="relative space-y-6">
              {/* Annual Hours Recovered */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-grey-600 text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>Annual Hours Recovered</span>
                </div>
                <div className="font-mono text-5xl sm:text-6xl font-bold text-warm-900 tracking-tight transition-all duration-500 ease-out">
                  {formatNumber(calculations.annualHoursRecovered)}
                  <span className="text-2xl font-normal text-grey-500 ml-2">hrs/yr</span>
                </div>
                <p className="mt-2 text-grey-500 text-sm">
                  Based on {formatNumber(calculations.weeklyHoursSaved)} hrs saved per week
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-grey-200" />
                </div>
                <div className="relative flex justify-center text-xs text-grey-500 px-4">
                  <span className="bg-gradient-to-br from-amber-50/50 via-white/90 to-orange-50/50 px-4">Projected Financial Impact</span>
                </div>
              </div>

              {/* Projected Cost Savings */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-grey-600 text-sm font-medium mb-2">
                  <DollarSign className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>Projected Cost Savings</span>
                </div>
                <div className="font-mono text-5xl sm:text-6xl font-bold text-amber-600 tracking-tight transition-all duration-500 ease-out">
                  {formatCurrency(calculations.projectedCostSavings)}
                  <span className="text-2xl font-normal text-grey-500 ml-2">/yr</span>
                </div>
                <p className="mt-2 text-grey-500 text-sm">
                  At ${hourlyRate}/hr average rate
                </p>
              </div>

              {/* Mini Breakdown Row */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-grey-200">
                <div className="bg-grey-50 border border-grey-200 rounded-xl p-4 text-center transition-all duration-300 hover:border-amber-300 hover:bg-amber-50">
                  <div className="flex items-center justify-center gap-2 text-grey-600 text-sm font-medium mb-1">
                    <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span>Weekly Hours Saved</span>
                  </div>
                  <div className="font-mono text-3xl font-bold text-warm-900 transition-all duration-300">
                    {formatNumber(calculations.weeklyHoursSaved)}
                  </div>
                  <div className="text-xs text-grey-500 mt-1">per week</div>
                </div>
                <div className="bg-grey-50 border border-grey-200 rounded-xl p-4 text-center transition-all duration-300 hover:border-amber-300 hover:bg-amber-50">
                  <div className="flex items-center justify-center gap-2 text-grey-600 text-sm font-medium mb-1">
                    <Users className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span>Equivalent FTE Gained</span>
                  </div>
                  <div className="font-mono text-3xl font-bold text-warm-900 transition-all duration-300">
                    {calculations.equivalentFTE.toFixed(1)}
                  </div>
                  <div className="text-xs text-grey-500 mt-1">full-time equivalents</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  type="button"
                  className="group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-xl border-[1.5px] bg-transparent px-8 py-4 text-base font-semibold cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-white hover:rounded-lg active:scale-[0.98]"
                  style={{ borderColor: "#d97706", color: "#d97706" }}
                >
                  <ArrowRight
                    className="absolute w-5 h-5 left-[-30%] fill-none z-10 group-hover:left-5 group-hover:stroke-white transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ stroke: "#d97706" }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10 -translate-x-2 group-hover:translate-x-2 transition-all duration-700 ease-out">
                    Schedule an Operational Audit
                  </span>
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full opacity-0 group-hover:w-[280px] group-hover:h-[280px] group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ backgroundColor: "#d97706" }}
                    aria-hidden="true"
                  />
                  <ArrowRight
                    className="absolute w-5 h-5 right-6 fill-none z-10 group-hover:right-[-30%] group-hover:stroke-white transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ stroke: "#d97706" }}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}