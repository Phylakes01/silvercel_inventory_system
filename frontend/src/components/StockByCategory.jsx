"use client"

import React, { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// 🧭 Chart data (using theme colors)
const chartData = [
  { category: "Rings", stock: 9, fill: "var(--chart-1)" },
  { category: "Bracelet", stock: 58, fill: "var(--chart-2)" },
  { category: "Necklace", stock: 756, fill: "var(--chart-3)" },
  { category: "Earrings", stock: 1578, fill: "var(--chart-4)" },
  { category: "Anklet", stock: 6578, fill: "var(--chart-5)" },
  { category: "Pendant", stock: 8461, fill: "var(--chart-1)" },
]

// 🎨 shadcn chart config
const chartConfig = {
  stock: {
    label: "Stock",
  },
  rings: {
    label: "Rings",
    color: "var(--chart-1)",
  },
  bracelet: {
    label: "Bracelet",
    color: "var(--chart-2)",
  },
  necklace: {
    label: "Necklace",
    color: "var(--chart-3)",
  },
  earrings: {
    label: "Earrings",
    color: "var(--chart-4)",
  },
  anklet: {
    label: "Anklet",
    color: "var(--chart-5)",
  },
  pendant: {
    label: "Pendant",
    color: "var(--chart-1)",
  },
}

// 🧩 Custom hook: debounce resize for smoother chart updates
function useDebouncedWindowWidth(delay = 200) {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    let timeout
    const handleResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setWidth(window.innerWidth), delay)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [delay])
  return width
}

export default function StockByCategory() {
  const width = useDebouncedWindowWidth()

  return (
    <Card className="flex flex-col bg-(--color-card) text-(--color-card-foreground) border border-(--color-border)">
      <CardHeader>
        <CardTitle className="sm:text-lg text-sm">Stock By Category</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Overview of available inventory</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          key={width} // ✅ Only rerenders after resizing stops
          config={chartConfig}
          className="w-full"
          style={{ height: `${chartData.length * 30 + 40}px` }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 40, right: 16, top: 2, bottom: 2 }}
              barSize={24}
            >
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={40}
                tickFormatter={(value) =>
                  chartConfig[value?.toLowerCase()]?.label || value
                }
              />
              <XAxis dataKey="stock" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="stock" radius={6}>
                {chartData.map((entry, index) => (
                  <cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm"> 
        <div className="text-muted-foreground leading-none">
          Showing current stock per category
        </div>
      </CardFooter>
    </Card>
  )
}
