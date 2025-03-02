"use client";
import React, { useState, useEffect } from "react";
import { PieChartComponent } from "@/components/chart/pie-chart/PieChart";
import { MonthYearSelect } from "@/components/reports/MonthYearSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ReportDetails } from "@/components/reports/ReportDetails";
import { TransactionDocument } from "@/models/Transaction";
import TableSkeleton from "@/components/common/table/table-skeleton";
import { columns } from "../transactions/columns";
import { PieChartSkeleton } from "@/components/chart/pie-chart/PieChartSkeleton";
const Container = () => {
  const [transactions, setTransactions] = useState<TransactionDocument[]>([]);
  const [month, setMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [transactionType, setTransactionType] = useState<"Thu" | "Chi">("Chi");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  function transformTransactions(transactions: TransactionDocument[]) {
    const groupedData: Record<
      string,
      { actualAmount: number; category: any; estimatedAmount: number }
    > = {};

    transactions.forEach((transaction: TransactionDocument) => {
      const { actualAmount, category, estimatedAmount } = transaction;

      // Chuyển _id thành chuỗi
      const categoryId = category?._id.toString();

      if (!groupedData[categoryId]) {
        groupedData[categoryId] = {
          actualAmount: Number(transaction.actualAmount),
          estimatedAmount: Number(transaction.estimatedAmount),
          category: {
            name: transaction.category?.name,
          },
        };
      } else {
        groupedData[categoryId].actualAmount += Number(actualAmount);
        groupedData[categoryId].estimatedAmount += Number(estimatedAmount);
      }
    });

    return Object.values(groupedData); // Chuyển đổi từ object thành array
  }

  const getReportData = async ({
    month,
    year,
    transactionType,
  }: {
    month: number | null;
    year: number;
    transactionType: "Thu" | "Chi";
  }) => {
    setIsLoading(true);
    try {
      let url = `/api/user/transaction?year=${year}&transactionType=${transactionType}`;
      if (month !== null && month > 0) {
        url += `&month=${month}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setTransactions(result.data);
      } else {
        const error = await response.json();
        console.error("Error fetching transactions:", error.message);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onMonthYearSelect = (
    selectedMonth: number | null,
    selectedYear: number
  ) => {
    setMonth(selectedMonth);
    setYear(selectedYear);
  };

  const onSelectTransactionType = (
    selectedType: "Thu" | "Chi" | string | any
  ) => {
    setTransactionType(selectedType);
  };

  useEffect(() => {
    getReportData({ month, year, transactionType });
  }, [month, year, transactionType]);

  return (
    <div className="space-y-4">
      {/* Chọn tháng và năm */}
      <MonthYearSelect
        onSelect={(selectedMonth: number | null, selectedYear: number) =>
          onMonthYearSelect(selectedMonth, selectedYear)
        }
      />
      <Card className="p-2">
        {/* Tabs để chọn loại giao dịch (Chi/Thu) */}
        <Tabs defaultValue="Chi" onValueChange={onSelectTransactionType}>
          <TabsList>
            <TabsTrigger value="Chi">Chi</TabsTrigger>
            <TabsTrigger value="Thu">Thu</TabsTrigger>
          </TabsList>
          {/* Hiển thị dữ liệu PieChart */}
          <TabsContent value="Chi">
            {isLoading ? (
              <>
                <PieChartSkeleton />
              </>
            ) : (
              <>
                <PieChartComponent
                  title="Số tiền chi"
                  data={transformTransactions(transactions).map(
                    (data: any) => ({
                      value: Number(data?.actualAmount),
                      category: String(data?.category?.name),
                    })
                  )}
                  dataKey="value"
                  nameKey="category"
                  colors={["#d4edda", "#28a745", "#155724"]} // Màu sắc biểu đồ
                  scaleMode="oklch"
                />
              </>
            )}
          </TabsContent>
          <TabsContent value="Thu">
            {isLoading ? (
              <>
                <PieChartSkeleton />
              </>
            ) : (
              <>
                <PieChartComponent
                  title="Số tiền thu"
                  data={transformTransactions(transactions).map(
                    (data: any) => ({
                      value: Number(data?.actualAmount),
                      category: String(data?.category?.name),
                    })
                  )}
                  dataKey="value"
                  nameKey="category"
                  colors={["#FFD700", "#FF8C00", "#FF4500", "#8B0000"]} // Màu sắc biểu đồ
                  scaleMode="oklch"
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </Card>
      {isLoading ? (
        <>
          Loading
          <TableSkeleton headers={columns} />
        </>
      ) : (
        <>
          <ReportDetails data={transformTransactions(transactions)} />
        </>
      )}
    </div>
  );
};

export default Container;
