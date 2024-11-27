import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription } from "@/components/ui/card";
const TransactionDateBlockSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-16 my-2 h-4" />
      <div className="flex flex-col gap-2">
        <Card className="border-[1px] p-4 flex flex-row gap-1 md:items-center">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between w-full items-start">
              <div className="w-2/3">
                <span className="font-bold">
                  <Skeleton className="w-16 h-2" />
                </span>
              </div>
              <div className="w-1/3">
                <div className="flex justify-end font-bold items-center">
                  <span className="text-sm">
                    <Skeleton className="w-full h-4" />
                  </span>
                </div>
              </div>
            </div>
            <CardDescription>
              <div className="flex justify-between md:justify-start w-full md:w-2/3 gap-2">
                <div className="w-1/2 md:w-fit flex flex-col md:flex-row items-start md:items-center">
                  <Skeleton className="w-full h-2" />
                  <span className="font-semibold">
                    <Skeleton className="w-full h-2" />
                  </span>
                </div>
              </div>
            </CardDescription>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDateBlockSkeleton;
