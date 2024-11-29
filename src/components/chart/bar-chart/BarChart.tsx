"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import chroma from "chroma-js";

import {
  ChartContainer,
  // ChartLegend,
  // ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartCommonProps<T> {
  title: string;
  data: T[];
  dataKey: keyof T;
  nameKey: keyof T;
  colors?: string[];
  scaleMode?: "oklch" | "lab" | "rgb";
  barRadius?: number;
  isVertical?: boolean | false;
}

const generateChartData = <T,>(
  data: T[],
  dataKey: keyof T,
  nameKey: keyof T,
  chartConfig: Record<string, { color: string }>
) => {
  return data.map((item) => ({
    value: item[dataKey] as number,
    name: item[nameKey] as string,
    fill: chartConfig[item[nameKey] as string]?.color || "#ccc", // Thêm màu sắc từ config
  }));
};

const generateChartConfig = <T,>(
  data: T[],
  nameKey: keyof T,
  colors: string[] = ["#d4edda", "#28a745", "#155724"],
  scaleMode: "oklch" | "lab" | "rgb" = "oklch"
) => {
  const uniqueNames = Array.from(
    new Set(data.map((item) => item[nameKey] as string))
  );

  const colorScale = chroma
    .scale(colors)
    .mode(scaleMode)
    .colors(uniqueNames.length);

  return uniqueNames.reduce((config, name, index) => {
    config[name] = {
      label: name.charAt(0).toUpperCase() + name.slice(1),
      color: colorScale[index],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);
};

export function BarChartComponent<T>(props: BarChartCommonProps<T>) {
  const {
    data,
    dataKey,
    nameKey,
    colors,
    scaleMode,
    barRadius = 0,
    isVertical = false,
    title,
  } = props;

  const chartConfig = React.useMemo(
    () => generateChartConfig(data, nameKey, colors, scaleMode),
    [data, nameKey, colors, scaleMode]
  );

  const chartData = React.useMemo(
    () => generateChartData(data, dataKey, nameKey, chartConfig),
    [data, dataKey, nameKey, chartConfig]
  );

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h3 className="font-semibold text-xl">{title}</h3>
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart
          data={chartData}
          width={700}
          height={100}
          layout={isVertical ? "vertical" : "horizontal"}
          barCategoryGap="5%"
          barGap="2px"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            // dataKey={!isVertical ? (nameKey as string) : undefined}
            dataKey={isVertical ? "value" : "name"}
            type={!isVertical ? "category" : "number"}
            tickLine={false}
            axisLine={false}
            // hide={isVertical}
          />
          <YAxis
            // dataKey={isVertical ? (nameKey as string) : undefined}
            dataKey={isVertical ? "name" : "value"}
            type={isVertical ? "category" : "number"}
            tickLine={false}
            axisLine={false}
            // hide={!isVertical}
          />
          <ChartTooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey={dataKey as string}
            radius={[barRadius, barRadius, 0, 0]}
            barSize={30}
          >
            <LabelList
              dataKey={dataKey as string}
              position="top"
              formatter={(val: any) => val.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  );
}
