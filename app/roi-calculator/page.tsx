import type { Metadata } from "next";
import { ROICalculator } from "@/components/ROICalculator";

export const metadata: Metadata = {
  title: "ROI Calculator · Derrick Odiwuor",
  description: "Calculate your team's operational efficiency gains and projected cost savings with our interactive ROI calculator.",
};

export default function ROICalculatorPage() {
  return (
    <>
      <ROICalculator />
    </>
  );
}