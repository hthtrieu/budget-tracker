"use client";
import React from "react";
import { PieChartComponent } from "@/components/chart/pie-chart/PieChart";
import mockData from "@/lib/mock/income_data_report.json";
import { BarChartComponent } from "@/components/chart/bar-chart/BarChart";

const Container = () => {
  return (
    <div>
      <PieChartComponent
        title="Sample Pie Chart"
        data={mockData.map((data: any) => ({
          value: data?.actualAmount,
          category: data?.category?.name,
        }))}
        dataKey="value"
        nameKey="category"
        colors={
          ["#d4edda", "#28a745", "#155724"] // Các màu xanh lá cây
        }
        scaleMode="lab"
      />
      <BarChartComponent
        title="Sample Bar Chart"
        data={mockData.map((data: any) => ({
          value: data?.actualAmount,
          category: data?.category?.name,
        }))}
        dataKey="value"
        nameKey="category"
        colors={["#d4edda", "#28a745", "#155724"]}
        scaleMode="lab"
        barRadius={8}
        isVertical={true}
      />
      ;
    </div>
  );
};

export default Container;
