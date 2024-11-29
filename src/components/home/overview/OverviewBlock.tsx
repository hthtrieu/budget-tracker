"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumberToVND, isFunction } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import CommonPopup from "@/components/common/popup/CommonPopup";
import TransactionForm from "@/components/transaction/TransactionForm";
import { BarChartComponent } from "@/components/chart/bar-chart/BarChart";
// import mockData from "@/lib/mock/overview_income_espense.json";
import { CategoryDocument } from "@/models/Category";
import { TransactionDocument } from "@/models/Transaction";

const OverviewBlock = ({
  onCreateTransaction,
  categoriesList,
  transactionsList,
}: {
  onCreateTransaction: any;
  categoriesList: CategoryDocument[];
  transactionsList: TransactionDocument[];
}) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [currentTransactionType, setCurrentTransactionType] = useState<
    "Thu" | "Chi"
  >("Thu");
  function transformTransactions(transactions: TransactionDocument[]) {
    const groupedData: Record<
      string,
      {
        actualAmount: number;
        estimatedAmount: number;
        transactionType: string;
      }
    > = {};

    transactions.forEach((transaction: TransactionDocument) => {
      const { actualAmount, estimatedAmount, transactionType } = transaction;

      if (!groupedData[transactionType]) {
        groupedData[transactionType] = {
          actualAmount: Number(transaction.actualAmount),
          estimatedAmount: Number(transaction.estimatedAmount),

          transactionType: transactionType,
        };
      } else {
        groupedData[transactionType].actualAmount += Number(actualAmount);
        groupedData[transactionType].estimatedAmount += Number(estimatedAmount);
        groupedData[transactionType].transactionType = transactionType;
      }
    });
    return Object.values(groupedData); // Chuyển đổi từ object thành array
  }
  const transformData = transformTransactions(transactionsList);
  const IncomeData = transformData.find(
    (data) => data.transactionType === "Thu"
  );
  const ExpenseData = transformData.find(
    (data) => data.transactionType === "Chi"
  );
  let title: string = "";

  const saveMoney =
    Number(IncomeData?.actualAmount) - Number(ExpenseData?.actualAmount);
  if (saveMoney > 0) {
    title = `Tháng này bạn đã tiết kiệm được ${formatNumberToVND(saveMoney)}`;
  }
  if (saveMoney < 0) {
    title = `Tháng này bạn bị âm ${formatNumberToVND(saveMoney)}`;
  }
  if (saveMoney == 0) {
    title = `Tháng này bạn khum tiết kiệm được đồng nào`;
  }

  return (
    <div className="py-2">
      <Card className="border-none">
        <CardContent className="p-2">
          <div className="w-full md:w-1/2 mx-auto">
            <BarChartComponent
              title={title || ""}
              data={transformData.map((data: any) => ({
                value: Number(data?.actualAmount),
                transactionType: String(data?.transactionType),
              }))}
              dataKey="value"
              nameKey="transactionType"
              colors={["#28a745", "#155724"]}
              scaleMode="oklch"
              barRadius={5}
              isVertical={true}
            />
          </div>
        </CardContent>
        <CardHeader className="flex justify-between flex-row gap-2">
          {/* Thu */}
          <div className="w-1/2 flex flex-col justify-between">
            <CardDescription>{"Thu"}</CardDescription>
            <CardTitle className="text-xl">
              {formatNumberToVND(IncomeData?.actualAmount)}
            </CardTitle>
            <Button
              size={"sm"}
              className="w-full"
              onClick={() => {
                setCurrentTransactionType("Thu");
                setIsOpenPopup(true);
              }}
            >
              <span className="font-semibold text-base">{"Thu"}</span>
              <PlusCircleIcon />
            </Button>
          </div>
          {/* Chi */}
          <div className="w-1/2 flex flex-col justify-between">
            <CardDescription>{"Chi"}</CardDescription>
            <CardTitle className="text-xl">
              {formatNumberToVND(ExpenseData?.actualAmount)}
            </CardTitle>
            <Button
              size={"sm"}
              className="w-full"
              onClick={() => {
                setCurrentTransactionType("Chi");
                setIsOpenPopup(true);
              }}
            >
              <span className="font-semibold text-base">{"Chi"}</span>
              <PlusCircleIcon />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Popup */}
      <CommonPopup
        open={isOpenPopup}
        setOpen={setIsOpenPopup}
        title={`Thêm dữ liệu ${currentTransactionType}`}
      >
        <TransactionForm
          defaultValues={{
            transactionType: currentTransactionType, // Giá trị dynamic
          }}
          categoryOptions={
            categoriesList
              ? categoriesList.map((cat: CategoryDocument) => ({
                  key: cat._id,
                  label: cat.name,
                }))
              : []
          }
          onSubmitTransactionForm={(data: any) => {
            if (isFunction(onCreateTransaction)) {
              onCreateTransaction(data);
              setIsOpenPopup(false);
            }
          }}
        />
      </CommonPopup>
    </div>
  );
};

export default OverviewBlock;
