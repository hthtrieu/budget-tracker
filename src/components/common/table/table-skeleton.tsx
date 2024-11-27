import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = ({ headers }: { headers: any }) => {
  return (
    <div className="w-full divide-y divide-primary-300 overflow-hidden border-x border-b border-primary-300">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          className="flex h-10 w-full items-center justify-items-start overflow-hidden"
          key={i}
        >
          {/* <div className="flex h-10 w-[38px] min-w-[38px] max-w-[38px] items-center justify-center border-r border-primary-300">
            <Skeleton className="h-6 w-6 min-w-6 rounded-md" />
          </div> */}
          {headers.map((header: any, j: number) => {
            return (
              <div
                key={j}
                className="flex h-full flex-1 items-center border-r border-primary-300 px-5 last:border-none"
                style={{
                  minWidth: header?.minWidth,
                  maxWidth: header?.maxWidth,
                  width: header?.width,
                  paddingLeft: header?.paddingLeft,
                  paddingRight: header?.paddingRight,
                }}
              >
                <Skeleton className="h-6 w-full rounded-md" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
