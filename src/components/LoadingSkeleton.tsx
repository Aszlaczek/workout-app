import { C } from "../lib/constants";

type LoadingSkeletonProps = {
  lines?: number;
  height?: string;
};

export default function LoadingSkeleton({ lines = 3, height = "h-4" }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} shimmer`}
          style={{
            background: C.dim,
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
}
