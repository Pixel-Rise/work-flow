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
import { useTranslation } from "@/components/language-provider";

const dayOffDates = [
  { date: new Date(2025, 5, 10), type: "sick_leave" }, // June 10, 2025 - Sick Leave
  { date: new Date(2025, 5, 15), type: "paid_time_off" }, // June 15, 2025 - Paid Time Off
  { date: new Date(2025, 5, 20), type: "personal_leave" }, // June 20, 2025 - Personal Leave
];

export default function DaysOffPage() {
  const t = useTranslation();

  // Modifiers yaratish
  const sickLeaveDates = dayOffDates
    .filter((item) => item.type === "sick_leave")
    .map((item) => item.date);
  const paidTimeOffDates = dayOffDates
    .filter((item) => item.type === "paid_time_off")
    .map((item) => item.date);
  const personalLeaveDates = dayOffDates
    .filter((item) => item.type === "personal_leave")
    .map((item) => item.date);

  const chartData = [
    { type: t("sick_leave"), value: 5, fill: "#eab308" }, // sariq - eng tashqarida
    { type: t("paid_time_off"), value: 4, fill: "#22c55e" }, // yashil - o'rtada
    { type: t("personal_leave"), value: 2, fill: "#ef4444" }, // qizil - eng ichkarida
  ];

  const chartConfig = {
    [t("personal_leave")]: {
      label: t("personal_leave"),
      color: "#ef4444",
    },
    [t("paid_time_off")]: {
      label: t("paid_time_off"),
      color: "#22c55e",
    },
    [t("sick_leave")]: {
      label: t("sick_leave"),
      color: "#eab308",
    },
  } satisfies ChartConfig;
  return (
    <div className="grid lg:grid-cols-2 gap-4 p-2">
      <Card>
        <CardHeader className="items-center pb-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle>{t("usage")}</CardTitle>
            <Button>{t("send_request")}</Button>
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
            {t("total_days_off_used")}: 13
          </div>
          <div className="text-muted-foreground leading-none">
            {t("showing_breakdown_leaves")}
          </div>
          <div className="flex justify-center flex-row gap-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span className="text-sm">{t("sick_leave")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-sm">{t("paid_time_off")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-sm">{t("personal_leave")}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className="h-full w-full p-0">
          <Calendar
            selectedDates={dayOffDates.map((item) => item.date)}
            className="w-full h-full"
            modifiers={{
              sickLeave: sickLeaveDates,
              paidTimeOff: paidTimeOffDates,
              personalLeave: personalLeaveDates,
            }}
            modifiersClassNames={{
              sickLeave:
                "bg-yellow-500 text-yellow-900 rounded border-yellow-500",
              paidTimeOff:
                "bg-green-500 text-green-900 rounded border-green-500",
              personalLeave: "bg-red-500 text-red-900 rounded border-red-500",
            }}
            components={{
              DayButton: ({ day }) => {
                const dayOff = dayOffDates.find(
                  (dayOffDate) =>
                    dayOffDate.date.toDateString() === day.date.toDateString()
                );

                if (dayOff) {
                  // Rang belgilash
                  let containerStyle = "";
                  let badgeStyle = "";
                  let typeText = "";

                  switch (dayOff.type) {
                    case "sick_leave":
                      containerStyle =
                        "bg-yellow-100 border-2 border-yellow-500";
                      badgeStyle = "bg-yellow-500 text-white";
                      typeText = "S";
                      break;
                    case "paid_time_off":
                      containerStyle = "bg-green-100 border-2 border-green-500";
                      badgeStyle = "bg-green-500 text-white";
                      typeText = "P";
                      break;
                    case "personal_leave":
                      containerStyle = "bg-red-100 border-2 border-red-500";
                      badgeStyle = "bg-red-500 text-white";
                      typeText = "L";
                      break;
                  }

                  return (
                    <button
                      className={`relative w-full h-full p-1 text-center rounded-md ${containerStyle}`}
                    >
                      <Badge
                        className={`absolute -top-1 -right-1 text-xs px-1 py-0 h-4 w-4 flex items-center justify-center rounded-full ${badgeStyle}`}
                      >
                        {typeText}
                      </Badge>
                      <span className="font-medium">{day.date.getDate()}</span>
                    </button>
                  );
                }

                return (
                  <button className="w-full h-full p-1 text-center hover:bg-accent rounded-md">
                    {day.date.getDate()}
                  </button>
                );
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
