"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransactionDateBlock from "./TransactionDateBlock";
import Link from "next/link";

import TransactionDateBlockSkeleton from "./TransactionDateBlockSkeleton";

const TransactionsList = ({
  groupedTransactions,
  isLoading,
}: {
  groupedTransactions: any;
  isLoading: boolean;
}) => {
  return (
    <div>
      <Card className="rounded-2xl border-[1px]">
        <CardHeader className="flex justify-between flex-row items-end">
          <CardTitle>{"Dữ liệu giao dịch"}</CardTitle>
          <CardDescription className="text-indigo-500 font-semibold">
            <Link href={"/transactions"}>{"Xem thêm"}</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* <TransactionDateBlockSkeleton /> */}

          {/* Hiển thị các TransactionDateBlock với dữ liệu tương ứng */}
          {isLoading ? (
            <>
              <TransactionDateBlockSkeleton />
              <TransactionDateBlockSkeleton />
              <TransactionDateBlockSkeleton />
              <TransactionDateBlockSkeleton />
            </>
          ) : (
            <>
              <TransactionDateBlock
                title="Hôm nay"
                transactions={groupedTransactions?.today}
              />
              <TransactionDateBlock
                title="Hôm qua"
                transactions={groupedTransactions?.yesterday}
              />
              <TransactionDateBlock
                title="Tuần này"
                transactions={groupedTransactions?.thisWeek}
              />
              <TransactionDateBlock
                title="Cũ hơn"
                transactions={groupedTransactions?.older}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsList;
