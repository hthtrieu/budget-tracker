import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function PieChartSkeleton() {
  return (
    <div className="mx-auto aspect-square max-h-[450px] flex flex-col items-center justify-center">
      {/* Vòng tròn loader */}
      <div className="relative w-36 h-36 animate-pulse rounded-full bg-muted flex items-center justify-center">
        <span className="absolute w-8 h-8 bg-background rounded-full">
          <Skeleton />
        </span>
      </div>
      {/* Placeholder cho legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-16 h-4 bg-muted rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
