"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadialBarChart, RadialBar } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

const chartData = [
  { type: "Paid Time Off", value: 8, fill: "var(--chart-1)" },
  { type: "Personal Leave", value: 3, fill: "var(--chart-2)" },
  { type: "Sick Leave", value: 2, fill: "var(--chart-3)" },
];

const chartConfig = {
  "Paid Time Off": {
    label: "Paid Time Off",
    color: "var(--chart-1)",
  },
  "Personal Leave": {
    label: "Personal Leave",
    color: "var(--chart-2)",
  },
  "Sick Leave": {
    label: "Sick Leave",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const dayOffDates = [
  new Date(2025, 5, 10), // June 10, 2025
  new Date(2025, 5, 15), // June 15, 2025
  new Date(2025, 5, 20), // June 20, 2025
];

export default function DaysOffPage() {
  return (
    <div className="grid lg:grid-cols-2 gap-4 p-2">
      <Card>
        <CardHeader className="items-center pb-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle>Usage</CardTitle>
            <Button>Send Request</Button>
          </div>
        </CardHeader>
        <CardContent className="">
          <ChartContainer config={chartConfig} className="mx-auto">
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={450}
              innerRadius={30}
              // outerRadius={10}
            >
              <RadialBar dataKey="value" background />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Total Days Off Used: 13
          </div>
          <div className="text-muted-foreground leading-none">
            Showing breakdown of all types of leaves
          </div>
          <div className="flex justify-center flex-row gap-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[var(--chart-1)] rounded-full" />
              <span className="text-sm">Paid Time Off</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[var(--chart-2)] rounded-full" />
              <span className="text-sm">Personal Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[var(--chart-3)] rounded-full" />
              <span className="text-sm">Sick Leave</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className="h-full w-full p-0">
          <Calendar
          selectedDates={dayOffDates}
            className="w-full h-full"
            onDayClick={(date) => {
              const isDayOff = dayOffDates.some(
                (dayOffDate) =>
                  dayOffDate.toDateString() === date.toDateString()
              );
              return (
                <div className="relative">
                  {isDayOff && (
                    <Badge className="absolute top-0 right-0 text-xs">
                      Day Off
                    </Badge>
                  )}
                  {date.getDate()}
                </div>
              );
            }}
          ></Calendar>
        </CardContent>
      </Card>
    </div>
  );
}
