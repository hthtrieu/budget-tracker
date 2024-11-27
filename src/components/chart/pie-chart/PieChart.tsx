"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import slugify from "slugify";
import chroma from "chroma-js";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumberToVND } from "@/lib/utils";

interface PieChartCommonProps<T> {
  title: string;
  data: T[];
  dataKey: keyof T;
  nameKey: keyof T;
  colors?: string[];
  scaleMode?: "oklch" | "lab" | "rgb";
}

const generateChartData = <T,>(
  data: T[],
  dataKey: keyof T,
  nameKey: keyof T
) => {
  return data.map((item) => {
    const originalName = item[nameKey] as string; // Giá trị gốc
    const slugName = slugify(originalName, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    }); // Chuyển thành slug
    return {
      value: item[dataKey] as number,
      name: slugName, // Sử dụng slug cho biểu đồ
      originalName, // Lưu tên gốc để hiển thị tooltip
      fill: `var(--color-${slugName})`,
    };
  });
};

const generateChartConfig = <T,>(
  data: T[],
  nameKey: keyof T,
  colors: string[] = ["#d4edda", "#28a745", "#155724"],
  scaleMode: "oklch" | "lab" | "rgb" = "oklch"
) => {
  const uniqueNames = Array.from(
    new Set(
      data.map((item) =>
        slugify(item[nameKey] as string, {
          lower: true,
          remove: /[*+~.()'"!:@]/g,
        })
      )
    )
  );

  const colorScale = chroma
    .scale(colors)
    .mode(scaleMode)
    .colors(uniqueNames.length);

  return uniqueNames.reduce((config, slug, index) => {
    const originalName = data.find(
      (item) =>
        slugify(item[nameKey] as string, {
          lower: true,
          remove: /[*+~.()'"!:@]/g,
        }) === slug
    )?.[nameKey] as string;

    config[slug] = {
      label: originalName.charAt(0).toUpperCase() + originalName.slice(1),
      color: colorScale[index],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);
};

export function PieChartComponent<T>(props: PieChartCommonProps<T>) {
  const { data, dataKey, nameKey, colors, scaleMode } = props;

  const chartConfig = React.useMemo(
    () => generateChartConfig(data, nameKey, colors, scaleMode),
    [data, nameKey, colors, scaleMode]
  );

  const chartData = React.useMemo(
    () => generateChartData(data, dataKey, nameKey),
    [data, dataKey, nameKey]
  );

  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [chartData]);
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[450px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-bold"
                    >
                      {formatNumberToVND(totalAmount)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {"Tổng"}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
