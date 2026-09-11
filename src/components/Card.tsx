import type { ReactNode } from "react";
import { C } from "../lib/constants";

type CardProps = {
  children: ReactNode;
  className?: string;
  borderLeft?: string;
  borderTop?: string;
  onClick?: () => void;
};

export default function Card({ children, className = "", borderLeft, borderTop, onClick }: CardProps) {
  return (
    <div
      className={`p-3 md:p-4 ${className}`}
      style={{
        background: C.card,
        borderLeft: borderLeft ? `3px solid ${borderLeft}` : undefined,
        borderTop: borderTop ? `2px solid ${borderTop}` : undefined,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
