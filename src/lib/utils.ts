import type { Exercise } from "../types";

export function exName(id: string, list: Exercise[]): string {
  return list.find((e) => e.id === id)?.name ?? id;
}

export function mkId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
}

export function formatDateFull(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}
