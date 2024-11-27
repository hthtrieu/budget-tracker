import React from "react";

export function BarChartSkeleton({
  isVertical = false,
}: {
  isVertical?: boolean;
}) {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Tiêu đề skeleton */}
      <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>

      {/* Biểu đồ skeleton */}
      <div
        className={`relative ${
          isVertical ? "h-64 w-40" : "h-40 w-64"
        } bg-muted rounded animate-pulse`}
      >
        {/* Thanh bar skeleton */}
        <div
          className={`absolute ${
            isVertical
              ? "w-8 h-16 bottom-2 left-8 bg-muted-foreground"
              : "h-8 w-12 bottom-2 left-8 bg-muted-foreground"
          } animate-pulse rounded`}
        ></div>
        <div
          className={`absolute ${
            isVertical
              ? "w-8 h-24 bottom-2 left-20 bg-muted-foreground"
              : "h-8 w-20 bottom-2 left-20 bg-muted-foreground"
          } animate-pulse rounded`}
        ></div>
        <div
          className={`absolute ${
            isVertical
              ? "w-8 h-12 bottom-2 left-32 bg-muted-foreground"
              : "h-8 w-16 bottom-2 left-32 bg-muted-foreground"
          } animate-pulse rounded`}
        ></div>
      </div>

      {/* Trục X/Y skeleton */}
      <div className="flex space-x-2 w-full justify-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-4 w-10 bg-muted animate-pulse rounded"
          ></div>
        ))}
      </div>
    </div>
  );
}
