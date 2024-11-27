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
import mockData from "@/lib/mock/overview_income_espense.json";
import { CategoryDocument } from "@/models/Category";

const OverviewBlock = ({
  onCreateTransaction,
  categoriesList,
}: {
  onCreateTransaction: any;
  categoriesList: CategoryDocument[];
}) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [currentTransactionType, setCurrentTransactionType] = useState<
    "Thu" | "Chi"
  >("Thu");

  return (
    <div className="py-2">
      <Card className="border-none">
        <CardContent className="p-2">
          <div className="w-full md:w-1/2 mx-auto">
            <BarChartComponent
              title="Thong ke chenh lech giua thuc te va du kien"
              data={mockData.map((data: any) => ({
                value: Math.abs(
                  data?.totalEstimatedAmount - data?.totalActualAmount
                ),
                type: data?.type ? "Thu" : "Chi",
              }))}
              dataKey="value"
              nameKey="type"
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
              {formatNumberToVND(1000000)}
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
              {formatNumberToVND(1000000)}
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
