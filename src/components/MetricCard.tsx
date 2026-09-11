import type { ReactNode } from "react";
import { C } from "../lib/constants";

type MetricCardProps = {
  label: string;
  value: string | number;
  color?: string;
  children?: ReactNode;
};

export default function MetricCard({ label, value, color = C.text, children }: MetricCardProps) {
  return (
    <div className="p-5" style={{ background: C.card, borderTop: `2px solid ${color}` }}>
      <div className="font-display font-bold text-xs tracking-widest mb-1" style={{ color: C.muted }}>
        {label}
      </div>
      <div className="font-mono font-bold text-2xl" style={{ color }}>
        {value}
      </div>
      {children}
    </div>
  );
}
