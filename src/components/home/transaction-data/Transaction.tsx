"use client";
import React from "react";
import { Card, CardDescription } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import { formatNumberToVND } from "@/lib/utils";
import { TransactionDocument } from "@/models/Transaction";
import { format } from "date-fns";

interface TransactionProps {
  transaction?: TransactionDocument;
}
const Transaction = (props: TransactionProps) => {
  // const chenhLech =
  //   Number(props?.transaction?.estimatedAmount) -
  //   Number(props?.transaction?.actualAmount);
  return (
    <Card className="border-[1px] p-4 flex flex-row gap-1 md:items-center">
      <CircleDollarSign />
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between w-full items-start">
          <div className="w-2/3">
            <span className="font-bold">
              {props?.transaction?.category?.name || ""}
            </span>
          </div>
          <div className="w-1/3 flex flex-col">
            <div
              className={`flex justify-end font-bold items-center gap-2 ${
                props?.transaction?.transactionType == "Thu"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {/* <Plus size={14} /> */}
              <span className={`text-sm `}>
                {`${props?.transaction?.transactionType}`}
              </span>
              <span className={`text-sm `}>
                {formatNumberToVND(Number(props?.transaction?.actualAmount))}
              </span>
            </div>
          </div>
        </div>
        <CardDescription>
          <div className="flex justify-between md:justify-start w-full md:w-2/3 gap-2">
            {/* <div className="w-1/2 md:w-fit flex flex-col md:flex-row items-start md:items-center">
              <span>{"Du kien: "}</span>
              <span className="font-semibold">
                {formatNumberToVND(Number(props?.transaction?.estimatedAmount))}
              </span>
            </div> */}
            {/* <span> </span> */}
            <div className="w-full md:w-fit flex  md:flex-row justify-between md:items-center gap-2">
              <span className="font-semibold">
                <span>{"Thuc te: "}</span>
                {formatNumberToVND(Number(props?.transaction?.actualAmount))}
              </span>
              <span className="font-semibold">
                {format(
                  new Date(props?.transaction?.transactionDate || ""),
                  "dd/MM/yyyy"
                )}
              </span>
            </div>
          </div>
        </CardDescription>
      </div>
      {/* <div className="flex flex-row w-full">
        <div className="w-2/3">
          <div className="flex flex-row">
            <div>
              <CardTitle>{"Category name"}</CardTitle>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <div className="flex font-bold items-center">
            <Plus size={14} />
            <span className="text-sm">{formatNumberToVND(500000)}</span>
          </div>
        </div>
      </div> */}
    </Card>
  );
};

export default Transaction;
