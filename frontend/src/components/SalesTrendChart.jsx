"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 🧩 Debounce resize to prevent laggy re-renders
function useDebouncedWindowWidth(delay = 200) {
  const [width, setWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
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

const chartData = [
  { date: "2024-04-01", totalSales: 3720, itemsSold: 124 }, 
  { date: "2024-04-02", totalSales: 2910, itemsSold: 97 }, 
  { date: "2024-04-03", totalSales: 5010, itemsSold: 167 }, 
  { date: "2024-04-04", totalSales: 7260, itemsSold: 242 }, 
  { date: "2024-04-05", totalSales: 11190, itemsSold: 373 }, 
  { date: "2024-04-06", totalSales: 9030, itemsSold: 301 }, 
  { date: "2024-04-07", totalSales: 7350, itemsSold: 245 }, 
  { date: "2024-04-08", totalSales: 12270, itemsSold: 409 }, 
  { date: "2024-04-09", totalSales: 1770, itemsSold: 59 }, 
  { date: "2024-04-10", totalSales: 7830, itemsSold: 261 }, 
  { date: "2024-04-11", totalSales: 9810, itemsSold: 327 }, 
  { date: "2024-04-12", totalSales: 8760, itemsSold: 292 }, 
  { date: "2024-04-13", totalSales: 10260, itemsSold: 342 }, 
  { date: "2024-04-14", totalSales: 4110, itemsSold: 137 }, 
  { date: "2024-04-15", totalSales: 3600, itemsSold: 120 }, 
  { date: "2024-04-16", totalSales: 4140, itemsSold: 138 }, 
  { date: "2024-04-17", totalSales: 13380, itemsSold: 446 }, 
  { date: "2024-04-18", totalSales: 10920, itemsSold: 364 }, 
  { date: "2024-04-19", totalSales: 7290, itemsSold: 243 }, 
  { date: "2024-04-20", totalSales: 2670, itemsSold: 89 }, 
  { date: "2024-04-21", totalSales: 4110, itemsSold: 137 }, 
  { date: "2024-04-22", totalSales: 6720, itemsSold: 224 }, 
  { date: "2024-04-23", totalSales: 4140, itemsSold: 138 }, 
  { date: "2024-04-24", totalSales: 11610, itemsSold: 387 }, 
  { date: "2024-04-25", totalSales: 6450, itemsSold: 215 }, 
  { date: "2024-04-26", totalSales: 2250, itemsSold: 75 }, 
  { date: "2024-04-27", totalSales: 11490, itemsSold: 383 }, 
  { date: "2024-04-28", totalSales: 3660, itemsSold: 122 }, 
  { date: "2024-04-29", totalSales: 9450, itemsSold: 315 }, 
  { date: "2024-04-30", totalSales: 13620, itemsSold: 454 }, 
  { date: "2024-05-01", totalSales: 4950, itemsSold: 165 }, 
  { date: "2024-05-02", totalSales: 8790, itemsSold: 293 }, 
  { date: "2024-05-03", totalSales: 7410, itemsSold: 247 }, 
  { date: "2024-05-04", totalSales: 11550, itemsSold: 385 }, 
  { date: "2024-05-05", totalSales: 14430, itemsSold: 481 }, 
  { date: "2024-05-06", totalSales: 14940, itemsSold: 498 }, 
  { date: "2024-05-07", totalSales: 11640, itemsSold: 388 }, 
  { date: "2024-05-08", totalSales: 4470, itemsSold: 149 }, 
  { date: "2024-05-09", totalSales: 6810, itemsSold: 227 }, 
  { date: "2024-05-10", totalSales: 8790, itemsSold: 293 }, 
  { date: "2024-05-11", totalSales: 10050, itemsSold: 335 }, 
  { date: "2024-05-12", totalSales: 5910, itemsSold: 197 }, 
  { date: "2024-05-13", totalSales: 5910, itemsSold: 197 }, 
  { date: "2024-05-14", totalSales: 13440, itemsSold: 448 }, 
  { date: "2024-05-15", totalSales: 14190, itemsSold: 473 }, 
  { date: "2024-05-16", totalSales: 10140, itemsSold: 338 }, 
  { date: "2024-05-17", totalSales: 14970, itemsSold: 499 }, 
  { date: "2024-05-18", totalSales: 9450, itemsSold: 315 }, 
  { date: "2024-05-19", totalSales: 7050, itemsSold: 235 }, 
  { date: "2024-05-20", totalSales: 5310, itemsSold: 177 }, 
  { date: "2024-05-21", totalSales: 2460, itemsSold: 82 }, 
  { date: "2024-05-22", totalSales: 2430, itemsSold: 81 }, 
  { date: "2024-05-23", totalSales: 7560, itemsSold: 252 }, 
  { date: "2024-05-24", totalSales: 8820, itemsSold: 294 }, 
  { date: "2024-05-25", totalSales: 6030, itemsSold: 201 }, 
  { date: "2024-05-26", totalSales: 6390, itemsSold: 213 }, 
  { date: "2024-05-27", totalSales: 12600, itemsSold: 420 }, 
  { date: "2024-05-28", totalSales: 6990, itemsSold: 233 }, 
  { date: "2024-05-29", totalSales: 2340, itemsSold: 78 }, 
  { date: "2024-05-30", totalSales: 10200, itemsSold: 340 }, 
  { date: "2024-05-31", totalSales: 5340, itemsSold: 178 }, 
  { date: "2024-06-01", totalSales: 5340, itemsSold: 178 }, 
  { date: "2024-06-02", totalSales: 14100, itemsSold: 470 }, 
  { date: "2024-06-03", totalSales: 3090, itemsSold: 103 }, 
  { date: "2024-06-04", totalSales: 13170, itemsSold: 439 }, 
  { date: "2024-06-05", totalSales: 2640, itemsSold: 88 }, 
  { date: "2024-06-06", totalSales: 8820, itemsSold: 294 }, 
  { date: "2024-06-07", totalSales: 9690, itemsSold: 323 }, 
  { date: "2024-06-08", totalSales: 11550, itemsSold: 385 }, 
  { date: "2024-06-09", totalSales: 13140, itemsSold: 438 }, 
  { date: "2024-06-10", totalSales: 4650, itemsSold: 155 }, 
  { date: "2024-06-11", totalSales: 2760, itemsSold: 92 }, 
  { date: "2024-06-12", totalSales: 14760, itemsSold: 492 }, 
  { date: "2024-06-13", totalSales: 2430, itemsSold: 81 }, 
  { date: "2024-06-14", totalSales: 12780, itemsSold: 426 }, 
  { date: "2024-06-15", totalSales: 9210, itemsSold: 307 }, 
  { date: "2024-06-16", totalSales: 11130, itemsSold: 371 }, 
  { date: "2024-06-17", totalSales: 14250, itemsSold: 475 }, 
  { date: "2024-06-18", totalSales: 3210, itemsSold: 107 }, 
  { date: "2024-06-19", totalSales: 10230, itemsSold: 341 }, 
  { date: "2024-06-20", totalSales: 12240, itemsSold: 408 }, 
  { date: "2024-06-21", totalSales: 5070, itemsSold: 169 }, 
  { date: "2024-06-22", totalSales: 9510, itemsSold: 317 }, 
  { date: "2024-06-23", totalSales: 14400, itemsSold: 480 }, 
  { date: "2024-06-24", totalSales: 3960, itemsSold: 132 }, 
  { date: "2024-06-25", totalSales: 4230, itemsSold: 141 }, 
  { date: "2024-06-26", totalSales: 13020, itemsSold: 434 }, 
  { date: "2024-06-27", totalSales: 13440, itemsSold: 448 }, 
  { date: "2024-06-28", totalSales: 4470, itemsSold: 149 }, 
  { date: "2024-06-29", totalSales: 3090, itemsSold: 103 }, 
  { date: "2024-06-30", totalSales: 13380, itemsSold: 446 },
  // ... (keep the rest of your data as-is)
]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  totalSales: {
    label: "Total Sales (₱)",
    color: "var(--chart-1)",
  },
  itemsSold: {
    label: "Items Sold",
    color: "var(--destructive)",
  },
}

export function SalesTrendChart() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const width = useDebouncedWindowWidth() // ✅ lag-free resize handling

  // Filter data by selected time range
  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-06-30")
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startDate = new Date(referenceDate)
    startDate.setDate(referenceDate.getDate() - days)

    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [timeRange])

  return (
    <Card className="pt-0 bg--card text-card-foreground border border-border">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="sm:text-lg text-sm">Sales Trends Over Time</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Showing total sales and items sold over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="sm:w-40 rounded-lg sm:ml-auto sm:flex text-xs sm:text-sm"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          key={width} // ✅ only re-render after resizing stops
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillItems" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--destructive)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--destructive)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="itemsSold"
                type="natural"
                fill="url(#fillItems)"
                stroke="var(--destructive)"
                strokeWidth={2}
              />
              <Area
                dataKey="totalSales"
                type="natural"
                fill="url(#fillSales)"
                stroke="var(--chart-1)"
                strokeWidth={2}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
