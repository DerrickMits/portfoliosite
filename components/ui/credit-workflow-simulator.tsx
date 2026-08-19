"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  DollarSign,
  CreditCard,
  Calculator,
  Timer,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Lock,
  Zap,
  TrendingUp,
  Shield,
  Play,
  RotateCcw,
  Mail,
  Smartphone,
  UserCheck,
  Flag,
  MonitorSmartphone,
  Building2 as BuildingIcon,
  AlertTriangle,
  Lock as LockIcon,
} from "lucide-react";
import { BorderRotate } from "./animated-gradient-border";
import { ExpandableTabs } from "./expandable-tabs";

// ============================================================================
// Constants
// ============================================================================

const PHASE_ICONS = {
  1: Building2,
  2: DollarSign,
  3: CreditCard,
  4: Calculator,
  5: Timer,
} as const;

const CRB_TIERS = {
  A: { minScore: 700, terms: 30, label: "Tier A — 30-Day Terms", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  B: { minScore: 600, terms: 14, label: "Tier B — 14-Day Terms", className: "bg-amber-50 text-amber-700 border-amber-200" },
  C: { minScore: 0, terms: 0, label: "Tier C — Cash Only", className: "bg-rose-50 text-rose-700 border-rose-200" },
} as const;

const PRESETS = [
  {
    key: "prime" as const,
    label: "Prime Clinic",
    description: "$10k revenue · $1.3k debt · Valid PPB · Clean CRB",
    revenue: 10000,
    existingDebt: 1300,
    ppbLicenseValid: true,
    crbScore: 750,
    cashFlowConsistency: 92,
  },
  {
    key: "marginal" as const,
    label: "Marginal Pharmacy",
    description: "$6k revenue · $1.8k debt · Low credit score",
    revenue: 6000,
    existingDebt: 1800,
    ppbLicenseValid: true,
    crbScore: 580,
    cashFlowConsistency: 65,
  },
  {
    key: "noncompliant" as const,
    label: "Non-Compliant Facility",
    description: "Missing PPB license → Auto stage lock",
    revenue: 8000,
    existingDebt: 2000,
    ppbLicenseValid: false,
    crbScore: 680,
    cashFlowConsistency: 78,
  },
];

const PHASE_DELAYS = [700, 900, 700, 1100, 700];

// ============================================================================
// Helpers
// ============================================================================

function getCRBRiskTier(score: number) {
  if (score >= CRB_TIERS.A.minScore) return CRB_TIERS.A;
  if (score >= CRB_TIERS.B.minScore) return CRB_TIERS.B;
  return CRB_TIERS.C;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateDebtServiceEngine(revenue: number, existingDebt: number) {
  const CAPACITY_RATIO = 0.43;
  const MONTHLY_RATE = 0.01;
  const TERM_MONTHS = 24;
  const maxCapacity = Math.round(Math.max(0, revenue) * CAPACITY_RATIO);
  const maxMonthlyInstallment = Math.max(0, Math.round(maxCapacity - Math.max(0, existingDebt)));
  const annuityFactor = (1 - Math.pow(1 + MONTHLY_RATE, -TERM_MONTHS)) / MONTHLY_RATE;
  const safePrincipal = Math.round(maxMonthlyInstallment * annuityFactor);
  return {
    maxCapacity,
    maxMonthlyInstallment,
    safePrincipal,
    isValid: revenue >= 2000 && revenue <= 30000 && existingDebt >= 0 && existingDebt <= 10000,
  };
}

// ============================================================================
// Types (inline for self-containment)
// ============================================================================

type PhaseStatus = "pending" | "processing" | "passed" | "locked" | "calculated" | "active";
type SimulationState = "idle" | "running" | "complete";
type PresetKey = "prime" | "marginal" | "noncompliant";

interface PhaseData {
  id: number;
  title: string;
  summary: string;
  icon: string;
  status: PhaseStatus;
  expanded: boolean;
  detail: PhaseDetail;
}

interface PhaseDetail {
  ppbLicenseValid?: boolean;
  revenue?: number;
  cashFlowConsistency?: number;
  crbScore?: number;
  riskTier?: 'A' | 'B' | 'C';
  existingDebt?: number;
  maxCapacity?: number;
  maxMonthlyInstallment?: number;
  safePrincipal?: number;
}

type PresetData = (typeof PRESETS)[number];

// ============================================================================
// Status Helpers
// ============================================================================

const STATUS_LABELS: Record<PhaseStatus, string> = {
  pending: "Pending",
  processing: "Processing…",
  passed: "Passed",
  locked: "Stage Locked",
  calculated: "Calculated",
  active: "Active",
};

const PHASE_ICON_COLORS: Record<PhaseStatus, string> = {
  pending: "bg-grey-100 text-grey-500",
  processing: "bg-amber-50 text-amber-600",
  passed: "bg-emerald-50 text-emerald-600",
  locked: "bg-rose-50 text-rose-600",
  calculated: "bg-emerald-50 text-emerald-600",
  active: "bg-emerald-50 text-emerald-600",
};

const STATUS_PILL_CLASSES: Record<PhaseStatus, string> = {
  pending: "bg-grey-100 text-grey-600 border-grey-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  passed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  locked: "bg-rose-50 text-rose-700 border-rose-200",
  calculated: "bg-emerald-50 text-emerald-700 border-emerald-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// ============================================================================
// INITIAL_PHASES
// ============================================================================

const INITIAL_PHASES: PhaseData[] = [
  {
    id: 1,
    title: "Statutory & Compliance Gate",
    summary: "PPB license verification — statutory prerequisite for credit terms",
    icon: "Building2",
    status: "pending",
    expanded: false,
    detail: { ppbLicenseValid: true },
  },
  {
    id: 2,
    title: "Multi-Source Cash Velocity",
    summary: "Revenue & cash flow consistency analysis for velocity calculation",
    icon: "DollarSign",
    status: "pending",
    expanded: false,
    detail: { revenue: 10000, cashFlowConsistency: 92 },
  },
  {
    id: 3,
    title: "External Credit Intelligence",
    summary: "CRB score mapping to risk tier & allowable payment terms",
    icon: "CreditCard",
    status: "pending",
    expanded: false,
    detail: { crbScore: 750, riskTier: "A" },
  },
  {
    id: 4,
    title: "Mathematical Debt Service Engine",
    summary: "43% capacity rule → annuity formula → safe credit principal cap",
    icon: "Calculator",
    status: "pending",
    expanded: false,
    detail: { existingDebt: 1300, maxCapacity: 0, maxMonthlyInstallment: 0, safePrincipal: 0 },
  },
  {
    id: 5,
    title: "Automated Collections Cadence",
    summary: "Multi-channel trigger timeline: T-5 → Due → Days 1-7 → Day 30+ freeze",
    icon: "Timer",
    status: "pending",
    expanded: false,
    detail: {},
  },
];

// ============================================================================
// Main Component
// ============================================================================

export default function CreditWorkflowSimulator() {
  const [phases, setPhases] = useState<PhaseData[]>(INITIAL_PHASES);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("prime");
  const [simulationState, setSimulationState] = useState<SimulationState>("idle");
  const [currentSimulatingPhase, setCurrentSimulatingPhase] = useState<number | null>(null);
  const [phasesCompleted, setPhasesCompleted] = useState(0);

  const presetData = PRESETS.find((p) => p.key === selectedPreset) || PRESETS[0];

  // Apply preset data
  const applyPreset = useCallback((preset: PresetData) => {
    setPhases((prev) =>
      prev.map((phase) => {
        let newDetail: PhaseDetail = { ...phase.detail };
        let newStatus: PhaseStatus = "pending";

        switch (phase.id) {
          case 1:
            newDetail = { ppbLicenseValid: preset.ppbLicenseValid };
            newStatus = preset.ppbLicenseValid ? "pending" : "locked";
            break;
          case 2:
            newDetail = { revenue: preset.revenue, cashFlowConsistency: preset.cashFlowConsistency };
            break;
          case 3: {
            const tierObj = getCRBRiskTier(preset.crbScore);
            const tierLetter = preset.crbScore >= 700 ? "A" : preset.crbScore >= 600 ? "B" : "C";
            newDetail = { crbScore: preset.crbScore, riskTier: tierLetter as 'A' | 'B' | 'C' };
            break;
          }
          case 4:
            newDetail = { existingDebt: preset.existingDebt, maxCapacity: 0, maxMonthlyInstallment: 0, safePrincipal: 0 };
            break;
          case 5:
            newDetail = {};
            break;
        }

        return { ...phase, detail: newDetail, status: newStatus, expanded: false };
      })
    );
  }, []);

  // Handle preset change
  const handlePresetChange = useCallback(
    (key: PresetKey) => {
      if (simulationState !== "idle") return;
      const preset = PRESETS.find((p) => p.key === key);
      if (preset) {
        setSelectedPreset(key);
        applyPreset(preset);
      }
    },
    [simulationState, applyPreset]
  );

  // Toggle phase expansion
  const handleToggleExpand = useCallback((id: number) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, expanded: !p.expanded } : { ...p, expanded: false }))
    );
  }, []);

  // Update phase detail
  const handleUpdateDetail = useCallback((id: number, detail: PhaseDetail) => {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, detail: { ...p.detail, ...detail } } : p))
    );
  }, []);

  // Recalculate Phase 4 when inputs change
  useEffect(() => {
    const phase2 = phases.find((p) => p.id === 2);
    const phase4 = phases.find((p) => p.id === 4);

    if (phase2 && phase4) {
      const { revenue } = phase2.detail;
      const { existingDebt } = phase4.detail;

      if (typeof revenue === "number" && typeof existingDebt === "number") {
        const result = calculateDebtServiceEngine(revenue, existingDebt);
        if (result.isValid) {
          setPhases((prev) =>
            prev.map((p) =>
              p.id === 4
                ? {
                    ...p,
                    detail: {
                      ...p.detail,
                      maxCapacity: result.maxCapacity,
                      maxMonthlyInstallment: result.maxMonthlyInstallment,
                      safePrincipal: result.safePrincipal,
                    },
                    status: "calculated" as PhaseStatus,
                  }
                : p
            )
          );
        }
      }
    }
  }, [phases]);

  // Run end-to-end simulation
  const handleRunSimulation = useCallback(async () => {
    if (simulationState !== "idle") return;

    setSimulationState("running");
    setPhasesCompleted(0);
    applyPreset(presetData);

    await new Promise((r) => setTimeout(r, 150));

    for (let i = 0; i < INITIAL_PHASES.length; i++) {
      const phaseId = i + 1;
      setCurrentSimulatingPhase(phaseId);

      // Phase 1 lock check
      if (phaseId === 1 && !presetData.ppbLicenseValid) {
        setPhases((prev) =>
          prev.map((p) => (p.id === phaseId ? { ...p, status: "locked" as PhaseStatus, expanded: true } : p))
        );
        await new Promise((r) => setTimeout(r, PHASE_DELAYS[i]));
        setPhasesCompleted((prev) => prev + 1);
        continue;
      }

      // Processing state
      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, status: "processing" as PhaseStatus, expanded: true } : p))
      );

      await new Promise((r) => setTimeout(r, PHASE_DELAYS[i]));

      // Resolve
      let newStatus: PhaseStatus = "passed";
      if (phaseId === 4) newStatus = "calculated";
      if (phaseId === 5) newStatus = "active";

      setPhases((prev) =>
        prev.map((p) => (p.id === phaseId ? { ...p, status: newStatus } : p))
      );

      setPhasesCompleted((prev) => prev + 1);
    }

    setCurrentSimulatingPhase(null);
    setSimulationState("complete");
  }, [simulationState, presetData, applyPreset]);

  // Reset
  const handleReset = useCallback(() => {
    setPhases(INITIAL_PHASES);
    setSelectedPreset("prime");
    setSimulationState("idle");
    setCurrentSimulatingPhase(null);
    setPhasesCompleted(0);
  }, []);

  const isRunning = simulationState === "running";
  const isComplete = simulationState === "complete";

  return (
    <section className="relative py-20 md:py-28 min-h-[60vh] overflow-hidden">
      {/* Warm Ash Aura Gradient — multiply blend layers */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 md:blur-[130px] blur-[90px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(214,204,190,0.12) 28%, rgb(255,255,255) 18%, rgb(196,181,160) 68%, rgb(168,148,122) 100%)",
            mixBlendMode: "multiply",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />
        <div
          className="absolute inset-0 md:blur-[130px] blur-[90px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(214,204,190,0.22) 34%, rgb(255,255,255) 66%, rgb(196,181,160) 82%, rgb(168,148,122) 100%)",
            mixBlendMode: "multiply",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8">
        {/* ── Premium Centered Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-grey-500 dark:text-grey-500 mb-4">
            Case Study · Interactive Simulator
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-warm-900 dark:text-cream leading-[1.1] max-w-3xl mx-auto">
            Healthcare Credit Risk & Collections Workflow
          </h2>
          <p className="mt-4 text-grey-600 dark:text-grey-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            From onboarding to recovery — a 5-phase underwriting and automation framework that
            reduced bad debt by 20% across 120 healthcare accounts.
          </p>
        </motion.div>

        {/* ── Control Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-16 z-20 bg-cream/80 dark:bg-deep/80 backdrop-blur-md rounded-2xl border border-grey-200 dark:border-warm-800 p-4 sm:p-5 mb-8 premium-shadow"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Preset Selector */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-grey-500 dark:text-grey-500 mr-1">
                Scenario
              </span>
              <ExpandableTabs
                tabs={[
                  { title: "Prime Clinic", icon: BuildingIcon },
                  { title: "Marginal Pharmacy", icon: AlertTriangle },
                  { title: "Non-Compliant Facility", icon: LockIcon },
                ]}
                activeColor="text-warm-900 dark:text-cream"
                className="bg-transparent border-none shadow-none p-0 w-full max-w-[560px]"
                onChange={(index) => {
                  if (index !== null) {
                    handlePresetChange(PRESETS[index].key);
                  }
                }}
              />
            </div>

            {/* Action Buttons & Progress */}
            <div className="flex items-center gap-3">
              {isRunning && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    Simulating… Phase {phasesCompleted} of 5
                  </span>
                </div>
              )}

              {isComplete && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Simulation Complete
                  </span>
                </div>
              )}

              {!isRunning && (
                <>
                  <button
                    onClick={handleRunSimulation}
                    disabled={isRunning}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-warm-900 dark:bg-cream text-cream dark:text-warm-900 text-sm font-semibold hover:bg-warm-800 dark:hover:bg-grey-200 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 shadow-md"
                  >
                    <Play className="w-4 h-4" />
                    <span>Run End-to-End Simulation</span>
                  </button>

                  {(isComplete || phasesCompleted > 0) && (
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-warm-800 text-warm-700 dark:text-grey-300 text-sm font-medium border border-grey-200 dark:border-warm-700 hover:bg-grey-50 dark:hover:bg-warm-700 active:scale-[0.97] transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Phase Pipeline ── */}
        <div className="space-y-4">
          {INITIAL_PHASES.map((initialPhase, index) => {
            const phase = phases.find((p) => p.id === initialPhase.id) || initialPhase;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                <PhaseCard
                  phase={phase}
                  onToggleExpand={handleToggleExpand}
                  onUpdateDetail={handleUpdateDetail}
                  isSimulationRunning={isRunning}
                  currentSimulatingPhase={currentSimulatingPhase}
                  simulationState={simulationState}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── Summary Footer ── */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="mt-10 p-6 sm:p-8 rounded-2xl bg-white dark:bg-warm-800 border border-grey-200 dark:border-warm-700 premium-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-warm-900 dark:text-cream text-lg">
                    Simulation Complete
                  </h3>
                  <p className="text-grey-500 dark:text-grey-400 text-sm">
                    All 5 phases resolved for{" "}
                    <span className="font-semibold text-warm-700 dark:text-grey-300">
                      {presetData.label}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryMetric
                  label="PPB License"
                  value={presetData.ppbLicenseValid ? "Valid" : "Missing"}
                  status={presetData.ppbLicenseValid ? "passed" : "locked"}
                />
                <SummaryMetric
                  label="Risk Tier"
                  value={getCRBRiskTier(presetData.crbScore).label.split(" — ")[0]}
                  status="passed"
                />
                <SummaryMetric
                  label="Credit Limit"
                  value={(phases.find((p) => p.id === 4)?.detail.safePrincipal || 0).toLocaleString()}
                  status="calculated"
                  prefix="$"
                />
                <SummaryMetric label="Collections" value="Automated" status="active" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================================
// Summary Metric
// ============================================================================

function SummaryMetric({
  label,
  value,
  status,
  prefix = "",
}: {
  label: string;
  value: string;
  status: PhaseStatus;
  prefix?: string;
}) {
  const statusColors: Record<PhaseStatus, string> = {
    passed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    calculated: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    locked: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    pending: "bg-grey-100 text-grey-600 dark:bg-warm-800 dark:text-grey-400",
    processing: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="p-4 rounded-xl bg-grey-50 dark:bg-warm-900 border border-grey-200 dark:border-warm-700">
      <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-grey-500 dark:text-grey-500 mb-1.5">
        {label}
      </p>
      <p className="font-display font-bold text-warm-900 dark:text-cream text-xl">
        {prefix}
        {value}
      </p>
      <span
        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

// ============================================================================
// Phase Detail Components
// ============================================================================

function Phase1Detail({ detail, onChange }: { detail: PhaseDetail; onChange: (u: Partial<PhaseDetail>) => void }) {
  const ppbValid = detail.ppbLicenseValid ?? true;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-700">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-warm-900 dark:text-cream">PPB Statutory License</p>
            <p className="text-sm text-grey-500 dark:text-grey-400">
              Pharmacy & Poisons Board practicing license verification
            </p>
          </div>
        </div>
        <button
          onClick={() => onChange({ ppbLicenseValid: !ppbValid })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-900 focus-visible:ring-offset-2 ${
            ppbValid ? "bg-emerald-600" : "bg-grey-300 dark:bg-warm-700"
          }`}
          role="switch"
          aria-checked={ppbValid}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              ppbValid ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!ppbValid ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-700 dark:text-rose-400">Stage Lock Active</p>
              <p className="text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                Credit terms extension blocked in CRM pipeline. PPB license is a statutory
                prerequisite.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">Compliance Verified</p>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                PPB license valid. Proceeding to cash velocity analysis.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Phase2Detail({ detail, onChange }: { detail: PhaseDetail; onChange: (u: Partial<PhaseDetail>) => void }) {
  const revenue = detail.revenue ?? 10000;
  const consistency = detail.cashFlowConsistency ?? 92;
  const velocity = Math.round(revenue * (consistency / 100));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-2">
            Gross Monthly Revenue
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400 text-sm">$</span>
            <input
              type="number"
              value={revenue}
              onChange={(e) => {
                const val = Math.max(2000, Math.min(30000, parseInt(e.target.value) || 2000));
                onChange({ revenue: val });
              }}
              min={2000}
              max={30000}
              step={500}
              className="w-full pl-7 pr-4 py-2.5 rounded-lg bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-700 text-warm-900 dark:text-cream text-sm placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-warm-900/20 focus:border-warm-900/40 transition-all"
              aria-label="Gross Monthly Revenue"
            />
          </div>
          <div className="flex justify-between text-xs text-grey-400 dark:text-grey-500 mt-1.5">
            <span>$2,000</span>
            <span>$30,000</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-2">
            Daily Cash Flow Consistency
          </label>
          <input
            type="range"
            value={consistency}
            onChange={(e) => onChange({ cashFlowConsistency: parseInt(e.target.value) })}
            min={0}
            max={100}
            step={1}
            className="w-full h-1.5 bg-grey-200 dark:bg-warm-700 rounded-full appearance-none cursor-pointer accent-warm-900 dark:accent-cream"
            aria-label="Cash Flow Consistency Index"
          />
          <div className="flex justify-between text-xs text-grey-400 dark:text-grey-500 mt-1.5">
            <span>0% Volatile</span>
            <span className="font-semibold text-warm-900 dark:text-cream">{consistency}%</span>
            <span>100% Stable</span>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-grey-500 dark:text-grey-400">Monthly Average Velocity</p>
            <p className="font-display font-bold text-warm-900 dark:text-cream text-2xl">
              {formatCurrency(velocity)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-grey-500 dark:text-grey-400">Consistency Factor</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">{consistency}%</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-grey-100 dark:border-warm-700 text-xs text-grey-400 dark:text-grey-500">
          {formatCurrency(revenue)} × {consistency}% = {formatCurrency(velocity)}/mo average
        </div>
      </div>
    </div>
  );
}

function Phase3Detail({ detail }: { detail: PhaseDetail }) {
  const score = detail.crbScore ?? 750;
  const tierInfo = getCRBRiskTier(score);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-700">
        <div>
          <p className="text-sm text-grey-500 dark:text-grey-400">CRB Score</p>
          <p className="font-display font-bold text-warm-900 dark:text-cream text-4xl">{score}</p>
        </div>
        <div
          className={`px-5 py-3 rounded-xl border text-center ${tierInfo.className} dark:border-opacity-30`}
        >
          <p className="font-semibold">{tierInfo.label}</p>
          <p className="text-sm opacity-80 mt-0.5">
            {tierInfo.terms > 0 ? `${tierInfo.terms}-day payment terms` : "Cash only — no credit terms"}
          </p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-grey-50 dark:bg-warm-900 border border-grey-200 dark:border-warm-700">
        <p className="font-semibold text-warm-900 dark:text-cream mb-3 text-sm">Risk Tier Criteria</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <TierBadge label="Tier A" subtext="Score ≥ 700" terms="30-day terms" active={score >= 700} color="emerald" />
          <TierBadge
            label="Tier B"
            subtext="Score 600–699"
            terms="14-day terms"
            active={score >= 600 && score < 700}
            color="amber"
          />
          <TierBadge label="Tier C" subtext="Score < 600" terms="Cash only" active={score < 600} color="rose" />
        </div>
      </div>
    </div>
  );
}

function TierBadge({
  label,
  subtext,
  terms,
  active,
  color,
}: {
  label: string;
  subtext: string;
  terms: string;
  active: boolean;
  color: "emerald" | "amber" | "rose";
}) {
  const colorMap = {
    emerald: {
      active: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-400",
    },
    amber: {
      active: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-400",
    },
    rose: {
      active: "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-400",
    },
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        active ? colorMap[color].active + " ring-1 ring-offset-1 dark:ring-offset-warm-800" : "bg-white dark:bg-warm-800 border-grey-200 dark:border-warm-700"
      }`}
    >
      <p className={`font-semibold ${active ? colorMap[color].text : "text-grey-500 dark:text-grey-400"}`}>
        {label}
      </p>
      <p className="text-grey-500 dark:text-grey-400 text-xs mt-0.5">{subtext}</p>
      <p className={`text-xs font-medium mt-1 ${active ? colorMap[color].text : "text-grey-400 dark:text-grey-500"}`}>
        {terms}
      </p>
    </div>
  );
}

function Phase4Detail({ detail, onChange }: { detail: PhaseDetail; onChange: (u: Partial<PhaseDetail>) => void }) {
  const revenue = detail.revenue ?? 10000;
  const existingDebt = detail.existingDebt ?? 1300;
  const { maxCapacity, maxMonthlyInstallment, safePrincipal, isValid } = calculateDebtServiceEngine(revenue, existingDebt);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-2">
          Existing Monthly Debt Obligations
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400 text-sm">$</span>
          <input
            type="number"
            value={existingDebt}
            onChange={(e) => {
              const val = Math.max(0, Math.min(10000, parseInt(e.target.value) || 0));
              onChange({ existingDebt: val });
            }}
            min={0}
            max={10000}
            step={100}
            className="w-full pl-7 pr-4 py-2.5 rounded-lg bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-700 text-warm-900 dark:text-cream text-sm placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-warm-900/20 focus:border-warm-900/40 transition-all"
            aria-label="Existing Monthly Debt"
          />
        </div>
        <div className="flex justify-between text-xs text-grey-400 dark:text-grey-500 mt-1.5">
          <span>$0</span>
          <span>$10,000</span>
        </div>
      </div>

      {!isValid && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm" role="alert">
          Invalid input values. Please adjust revenue or debt.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormulaCard
          label="Max Capacity (43%)"
          value={formatCurrency(maxCapacity)}
          formula="Revenue × 0.43"
          calculation={`${formatCurrency(revenue)} × 0.43 = ${formatCurrency(maxCapacity)}`}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        />
        <FormulaCard
          label="Max Monthly Installment"
          value={formatCurrency(maxMonthlyInstallment)}
          formula="Capacity − Existing Debt"
          calculation={`${formatCurrency(maxCapacity)} − ${formatCurrency(existingDebt)} = ${formatCurrency(maxMonthlyInstallment)}`}
          icon={<DollarSign className="w-4 h-4 text-warm-700 dark:text-grey-300" />}
        />
        <FormulaCard
          label="Safe Credit Principal"
          value={formatCurrency(safePrincipal)}
          formula="P × [1 − (1+r)⁻ⁿ] / r"
          calculation={`r=1% monthly, n=24 → Factor 21.243 → ${formatCurrency(maxMonthlyInstallment)} × 21.243`}
          icon={<Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          highlight
        />
      </div>

      <div className="p-5 rounded-xl bg-grey-50 dark:bg-warm-900 border border-grey-200 dark:border-warm-700">
        <p className="font-semibold text-warm-900 dark:text-cream text-sm mb-3">Formula Breakdown</p>
        <div className="space-y-1.5 font-mono text-xs sm:text-sm text-grey-600 dark:text-grey-400">
          <p>
            Max Capacity = {formatCurrency(revenue)} × 0.43 ={" "}
            <span className="font-semibold text-warm-900 dark:text-cream">{formatCurrency(maxCapacity)}</span>
          </p>
          <p>
            Max Installment (P) = {formatCurrency(maxCapacity)} − {formatCurrency(existingDebt)} ={" "}
            <span className="font-semibold text-warm-900 dark:text-cream">{formatCurrency(maxMonthlyInstallment)}</span>
          </p>
          <p>
            Annuity Factor = [1 − (1 + 0.01)⁻²⁴] / 0.01 = 21.243
          </p>
          <p>
            Safe Principal = {formatCurrency(maxMonthlyInstallment)} × 21.243 ={" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(safePrincipal)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Phase5Detail() {
  const triggers = [
    {
      id: "t-5",
      label: "T-5 Days",
      timing: "5 days before due date",
      description: "SMS & Email soft reminder sent automatically",
      channel: ["SMS", "Email"],
      icon: Mail,
    },
    {
      id: "due",
      label: "Due Date",
      timing: "Payment due date",
      description: "Direct payment portal link delivered via all channels",
      channel: ["SMS", "Email", "Portal"],
      icon: MonitorSmartphone,
    },
    {
      id: "days-1-7",
      label: "Days 1–7 Overdue",
      timing: "1–7 days past due",
      description: "Automated CRM task assigned to Account Manager for personal outreach",
      channel: ["CRM Task", "Phone", "Email"],
      icon: UserCheck,
    },
    {
      id: "day-30",
      label: "Day 30+ Overdue",
      timing: "30+ days past due",
      description: "Central dashboard flag & automated credit freeze enacted",
      channel: ["Dashboard", "System Lock", "Legal"],
      icon: Flag,
    },
  ];

  return (
    <div className="space-y-3">
      {triggers.map((trigger, index) => (
        <motion.div
          key={trigger.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3 }}
          className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-700 hover:border-grey-300 dark:hover:border-warm-600 transition-colors"
        >
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                index === 0 ? "bg-emerald-500 dark:bg-emerald-400" : "bg-grey-300 dark:bg-warm-600"
              }`}
            />
            {index < triggers.length - 1 && (
              <div className="w-px h-14 bg-grey-200 dark:bg-warm-700 mt-1.5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[11px] text-grey-500 dark:text-grey-400 px-2 py-0.5 rounded bg-grey-100 dark:bg-warm-800">
                {trigger.label}
              </span>
              <span className="text-sm font-medium text-warm-900 dark:text-cream">{trigger.timing}</span>
            </div>
            <p className="text-sm text-grey-500 dark:text-grey-400 mt-1">{trigger.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {trigger.channel.map((ch) => (
                <span
                  key={ch}
                  className="px-2.5 py-0.5 text-[11px] rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <span className="px-2.5 py-1 text-[11px] rounded-full bg-grey-100 dark:bg-warm-800 text-grey-500 dark:text-grey-400 border border-grey-200 dark:border-warm-700 font-medium">
              Scheduled
            </span>
          </div>
        </motion.div>
      ))}

      <div className="p-5 rounded-xl bg-grey-50 dark:bg-warm-900 border border-grey-200 dark:border-warm-700">
        <p className="font-semibold text-warm-900 dark:text-cream text-sm mb-2">Automation Rules</p>
        <ul className="text-sm text-grey-500 dark:text-grey-400 space-y-1.5">
          <li>• All triggers fire automatically via CRM workflow engine</li>
          <li>• Multi-channel delivery ensures 99.2% reach rate (case study metric)</li>
          <li>• Day 30+ freeze is instantaneous — no manual intervention required</li>
          <li>• Account Manager tasks auto-assign with priority scoring</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// Formula Card
// ============================================================================

function FormulaCard({
  label,
  value,
  formula,
  calculation,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  formula: string;
  calculation: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        highlight
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 ring-1 dark:ring-emerald-700/50"
          : "bg-white dark:bg-warm-900 border-grey-200 dark:border-warm-700"
      }`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg bg-grey-100 dark:bg-warm-800 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-500 dark:text-grey-400">
          {label}
        </span>
      </div>
      <p className="font-display font-bold text-warm-900 dark:text-cream text-2xl mb-1">{value}</p>
      <p className="text-[11px] font-mono text-grey-400 dark:text-grey-500 mb-0.5">{formula}</p>
      <p className="text-[11px] text-grey-400 dark:text-grey-500 leading-relaxed">{calculation}</p>
    </div>
  );
}

// ============================================================================
// Phase Card
// ============================================================================

interface PhaseCardProps {
  phase: PhaseData;
  onToggleExpand: (id: number) => void;
  onUpdateDetail: (id: number, detail: PhaseDetail) => void;
  isSimulationRunning: boolean;
  currentSimulatingPhase: number | null;
  simulationState: string;
}

function PhaseCard({
  phase,
  onToggleExpand,
  onUpdateDetail,
  isSimulationRunning,
  currentSimulatingPhase,
  simulationState,
}: PhaseCardProps) {
  const IconComponent = PHASE_ICONS[phase.id as keyof typeof PHASE_ICONS] || Building2;
  const isProcessing = isSimulationRunning && currentSimulatingPhase === phase.id;
  const effectiveStatus = isProcessing ? "processing" : phase.status;

  // Use a string key that changes when simulation resets/advances.
  // This forces the detail component to remount with fresh local state
  // instead of creating an infinite update loop via useEffect.
  const detailResetKey = `${phase.id}-${simulationState === "running" ? currentSimulatingPhase ?? "idle" : simulationState}`;

  const handleDetailChange = (updates: Partial<PhaseDetail>) => {
    onUpdateDetail(phase.id, updates);
  };

  const renderPhaseDetail = () => {
    switch (phase.id) {
      case 1:
        return <Phase1Detail key={`p1-${detailResetKey}`} detail={phase.detail} onChange={handleDetailChange} />;
      case 2:
        return <Phase2Detail key={`p2-${detailResetKey}`} detail={phase.detail} onChange={handleDetailChange} />;
      case 3:
        return <Phase3Detail key={`p3-${detailResetKey}`} detail={phase.detail} />;
      case 4:
        return <Phase4Detail key={`p4-${detailResetKey}`} detail={phase.detail} onChange={handleDetailChange} />;
      case 5:
        return <Phase5Detail key={`p5-${detailResetKey}`} />;
      default:
        return null;
    }
  };

  return (
    <BorderRotate
      animationSpeed={8}
      borderRadius={16}
      borderWidth={1}
      backgroundColor="#FAF9F6"
    >
      <motion.div
        layout
        className={`rounded-2xl bg-white dark:bg-warm-800 transition-all duration-300 ${
          phase.expanded ? "premium-shadow" : "hover:shadow-md"
        }`}
      >
      {/* Collapsed Header */}
      <button
        onClick={() => onToggleExpand(phase.id)}
        className="w-full p-5 flex items-center gap-4 hover:bg-grey-50 dark:hover:bg-warm-900/50 transition-colors duration-200 text-left"
        aria-expanded={phase.expanded}
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${PHASE_ICON_COLORS[effectiveStatus]}`}
        >
          <IconComponent className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-warm-900 dark:text-cream text-[15px]">{phase.title}</h3>
          <p className="text-grey-500 dark:text-grey-400 text-sm mt-0.5 truncate">{phase.summary}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <motion.span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${STATUS_PILL_CLASSES[effectiveStatus]}`}
            key={effectiveStatus}
            animate={{ opacity: isProcessing ? [1, 0.6, 1] : 1 }}
            transition={{ duration: isProcessing ? 1.5 : 0, repeat: isProcessing ? Infinity : 0 }}
          >
            {effectiveStatus === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
            {effectiveStatus === "passed" && <CheckCircle2 className="w-3 h-3" />}
            {effectiveStatus === "locked" && <Lock className="w-3 h-3" />}
            {effectiveStatus === "calculated" && <Calculator className="w-3 h-3" />}
            {effectiveStatus === "active" && <Zap className="w-3 h-3" />}
            <span>{STATUS_LABELS[effectiveStatus]}</span>
          </motion.span>

          <motion.div
            className="w-7 h-7 rounded-md flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-warm-900 dark:hover:text-cream hover:bg-grey-100 dark:hover:bg-warm-700 transition-all"
            animate={{ rotate: phase.expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Detail Panel */}
      <AnimatePresence initial={false}>
        {phase.expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-grey-200 dark:border-warm-700"
          >
            <div className="p-5 sm:p-6">{renderPhaseDetail()}</div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </BorderRotate>
  );
}