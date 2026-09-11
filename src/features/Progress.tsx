import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, BarChart, Bar,
} from "recharts";
import { C } from "../lib/constants";
import { useI18n } from "../i18n";
import { exName } from "../lib/utils";
import type { Exercise, Workout } from "../types";

type Props = {
  exercises: Exercise[];
  workouts: Workout[];
};

export default function Progress({ exercises, workouts }: Props) {
  const { t } = useI18n();
  const [selEx, setSelEx] = useState("bench");
  const [chartType, setChartType] = useState<"load" | "volume" | "1rm">("load");

  const exWithData = useMemo(() => {
    const ids = new Set(workouts.flatMap((w) => w.exercises.map((e) => e.exerciseId)));
    return exercises.filter((e) => ids.has(e.id));
  }, [workouts, exercises]);

  const chartData = useMemo(() => {
    return workouts
      .filter((w) => w.exercises.some((e) => e.exerciseId === selEx))
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map((w) => {
        const ex = w.exercises.find((e) => e.exerciseId === selEx)!;
        const doneSets = ex.sets.filter((s) => s.done);
        const maxLoad = Math.max(...doneSets.map((s) => Number(s.weight) || 0), 0);
        const volume = doneSets.reduce((s, set) => s + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0);
        const best1rm = Math.max(...doneSets.map((s) => {
          const w = Number(s.weight) || 0;
          const r = Number(s.reps) || 1;
          return r > 1 ? w * (1 + r / 30) : w;
        }), 0);
        return {
          date: w.date.slice(5),
          load: maxLoad,
          volume,
          oneRM: Math.round(best1rm),
        };
      });
  }, [workouts, selEx]);

  const pr = chartData.length ? Math.max(...chartData.map((d) => d.load)) : 0;
  const avg = chartData.length ? Math.round(chartData.reduce((s, d) => s + d.load, 0) / chartData.length) : 0;
  const trend = chartData.length >= 2 ? chartData.at(-1)!.load - chartData[0].load : 0;

  const muscleVolume = useMemo(() => {
    const vol: Record<string, number> = {};
    workouts.forEach((w) => {
      w.exercises.forEach((e) => {
        const ex = exercises.find((x) => x.id === e.exerciseId);
        if (ex) {
          const total = e.sets.filter((s) => s.done).reduce((a, s) => a + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
          vol[ex.muscle] = (vol[ex.muscle] || 0) + total;
        }
      });
    });
    return Object.entries(vol)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [workouts, exercises]);

  const freqStats = useMemo(() => {
    const thisWeek = workouts.filter((w) => {
      const d = new Date(w.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    });
    const thisMonth = workouts.filter((w) => {
      const d = new Date(w.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return {
      week: thisWeek.length,
      month: thisMonth.length,
      total: workouts.length,
    };
  }, [workouts]);

  const dataKey = chartType === "load" ? "load" : chartType === "volume" ? "volume" : "oneRM";
  const dataLabel = chartType === "load" ? "kg" : chartType === "volume" ? "kg-rep" : "kg (1RM)";

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-24 md:pb-8">
        <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight mb-5 md:mb-8" style={{ color: C.text }}>
          {t("progress.title")}
        </h1>

        {/* Exercise selector - horizontal scroll on mobile */}
        <div className="flex gap-1.5 mb-4 md:mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap" style={{ WebkitOverflowScrolling: "touch" }}>
          {exWithData.map((e) => (
            <button key={e.id} onClick={() => setSelEx(e.id)}
              className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 py-1.5 transition-all shrink-0"
              style={{
                background: selEx === e.id ? C.orange : C.card,
                color: selEx === e.id ? "#fff" : C.muted,
                border: `1px solid ${selEx === e.id ? C.orange : C.border}`,
              }}>
              {e.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
          {[
            { label: t("progress.pr"), val: pr > 0 ? `${pr} kg` : "-" },
            { label: t("progress.avg"), val: avg > 0 ? `${avg} kg` : "-" },
            { label: t("progress.trend"), val: trend !== 0 ? `${trend > 0 ? "+" : ""}${trend} kg` : "-", accent: trend > 0 ? C.cyan : trend < 0 ? C.red : C.muted },
          ].map(({ label, val, accent }) => (
            <div key={label} className="p-3 md:p-5" style={{ background: C.card, borderTop: `2px solid ${C.orange}` }}>
              <div className="font-display font-bold text-[9px] md:text-xs tracking-widest mb-1" style={{ color: C.muted }}>{label}</div>
              <div className="font-mono font-bold text-base md:text-2xl" style={{ color: accent ?? C.text }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Chart type selector - horizontal scroll on mobile */}
        <div className="flex gap-1.5 mb-3 md:mb-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap" style={{ WebkitOverflowScrolling: "touch" }}>
          {([
            { v: "load" as const, l: t("progress.maxLoad") },
            { v: "volume" as const, l: t("progress.volume") },
            { v: "1rm" as const, l: t("progress.estimated1rm") },
          ]).map(({ v, l }) => (
            <button key={v} onClick={() => setChartType(v)}
              className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 py-1.5 transition-all shrink-0"
              style={{
                background: chartType === v ? C.violet : C.card,
                color: chartType === v ? "#fff" : C.muted,
                border: `1px solid ${chartType === v ? C.violet : C.border}`,
              }}>
              {l}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="p-4 md:p-6 mb-6 md:mb-8" style={{ background: C.card }}>
          <div className="font-display font-bold text-[9px] md:text-xs tracking-widest mb-4 md:mb-6" style={{ color: C.muted }}>
            {exName(selEx, exercises).toUpperCase()} — {dataLabel} / {t("progress.perSession")}
          </div>
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={200}>
              {chartType === "volume" ? (
                <BarChart data={chartData}>
                  <CartesianGrid stroke={C.dim} strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="date"
                    tick={{ fill: C.muted, fontFamily: "JetBrains Mono", fontSize: 9 }}
                    axisLine={{ stroke: C.border }} tickLine={false} />
                  <YAxis
                    tick={{ fill: C.muted, fontFamily: "JetBrains Mono", fontSize: 9 }}
                    axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 10, color: C.text }}
                    labelStyle={{ color: C.muted }} cursor={{ fill: C.dim }} />
                  <Bar dataKey="volume" fill={C.violet} name="Objetosc" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid stroke={C.dim} strokeDasharray="0" vertical={false} />
                  <XAxis dataKey="date"
                    tick={{ fill: C.muted, fontFamily: "JetBrains Mono", fontSize: 9 }}
                    axisLine={{ stroke: C.border }} tickLine={false} />
                  <YAxis
                    tick={{ fill: C.muted, fontFamily: "JetBrains Mono", fontSize: 9 }}
                    axisLine={false} tickLine={false} width={32} />
                  {pr > 0 && chartType === "load" && (
                    <ReferenceLine y={pr} stroke={C.violet} strokeDasharray="4 4"
                      label={{ value: `PR ${pr}kg`, fill: C.violet, fontSize: 9, fontFamily: "JetBrains Mono" }} />
                  )}
                  <Tooltip
                    contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 10, color: C.text }}
                    labelStyle={{ color: C.muted }} cursor={{ stroke: C.dim }} />
                  <Line type="monotone" dataKey={dataKey}
                    stroke={chartType === "1rm" ? C.cyan : C.orange} strokeWidth={2}
                    dot={{ fill: chartType === "1rm" ? C.cyan : C.orange, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }} name={dataLabel} />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-32 md:h-40">
              <p className="font-mono text-xs md:text-sm text-center" style={{ color: C.muted }}>
                {t("progress.noData")}
              </p>
            </div>
          )}
        </div>

        {/* Muscle volume analysis */}
        <div className="p-4 md:p-6 mb-6 md:mb-8" style={{ background: C.card }}>
          <div className="font-display font-bold text-[9px] md:text-xs tracking-widest mb-3 md:mb-4" style={{ color: C.muted }}>
            {t("progress.muscleVolume")}
          </div>
          {muscleVolume.length > 0 ? (
            <div className="space-y-2.5 md:space-y-3">
              {muscleVolume.map((m) => {
                const maxVal = muscleVolume[0].value;
                const pct = maxVal > 0 ? (m.value / maxVal) * 100 : 0;
                return (
                  <div key={m.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] md:text-xs truncate mr-2" style={{ color: C.text }}>{m.name}</span>
                      <span className="font-mono text-[10px] md:text-xs shrink-0" style={{ color: C.muted }}>{(m.value / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="h-1.5 md:h-2 w-full" style={{ background: C.dim }}>
                      <div className="h-full transition-all" style={{ width: `${pct}%`, background: C.violet }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-mono text-xs md:text-sm" style={{ color: C.muted }}>{t("progress.noDataMuscle")}</p>
          )}
        </div>

        {/* Frequency stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {[
            { label: t("progress.week"), val: freqStats.week },
            { label: t("progress.month"), val: freqStats.month },
            { label: t("progress.total"), val: freqStats.total },
          ].map(({ label, val }) => (
            <div key={label} className="p-3 md:p-5 text-center" style={{ background: C.card, borderTop: `2px solid ${C.cyan}` }}>
              <div className="font-display font-bold text-[9px] md:text-xs tracking-widest mb-1" style={{ color: C.muted }}>{label}</div>
              <div className="font-mono font-bold text-2xl md:text-3xl" style={{ color: C.cyan }}>{val}</div>
              <div className="font-display text-[9px] md:text-xs" style={{ color: C.muted }}>{t("progress.trainings")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
