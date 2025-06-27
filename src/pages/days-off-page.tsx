import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { RadialBarChart, RadialBar } from "recharts";
import { useTranslation } from "@/hooks/use-language";
import { usePageTitle } from "@/hooks/use-title";
import { useMemo } from "react";

// ✅ Sanani normalize qilish
function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// ✅ Dam olish kunlari ro'yxati
const rawDayOffDates = [
  { date: new Date(2025, 5, 10), type: "sick_leave" },
  { date: new Date(2025, 5, 15), type: "paid_time_off" },
  { date: new Date(2025, 5, 20), type: "personal_leave" },
] as const;

// ✅ Har bir tur uchun konfiguratsiya
const leaveTypes = {
  sick_leave: { label: "sick_leave", color: "#eab308", short: "S" },
  paid_time_off: { label: "paid_time_off", color: "#22c55e", short: "P" },
  personal_leave: { label: "personal_leave", color: "#ef4444", short: "L" },
} as const;

export default function DaysOffPage() {
  const t = useTranslation();
  
  // Set page title
  usePageTitle(t("dayoff"));

  // ✅ Normalize qilingan dam olish kunlari
  const dayOffDates = rawDayOffDates.map((item) => ({
    ...item,
    date: normalizeDate(item.date),
  }));

  // ✅ Har bir tur uchun sanalarni ajratib olish
  const groupedDates = useMemo(() => {
    const groups: Record<keyof typeof leaveTypes, Date[]> = {
      sick_leave: [],
      paid_time_off: [],
      personal_leave: [],
    };
    dayOffDates.forEach(({ date, type }) => {
      groups[type].push(date);
    });
    return groups;
  }, [dayOffDates]);

  // ✅ Chart ma'lumotlari
  const chartData = [
    { type: t("sick_leave"), value: 5, fill: leaveTypes.sick_leave.color },
    { type: t("paid_time_off"), value: 4, fill: leaveTypes.paid_time_off.color },
    { type: t("personal_leave"), value: 2, fill: leaveTypes.personal_leave.color },
  ];

  const chartConfig: ChartConfig = Object.fromEntries(
    Object.entries(leaveTypes).map(([, { label, color }]) => [
      t(label),
      { label: t(label), color },
    ])
  );

  return (
    <div className="grid lg:grid-cols-2 gap-3">
      {/* 1. CHART */}
      <Card>
        <CardHeader className="flex justify-between items-center pb-0">
          <CardTitle>{t("usage")}</CardTitle>
          <Button>{t("send_request")}</Button>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto">
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={450}
              innerRadius={30}
            >
              <RadialBar dataKey="value" background />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm">
          <div className="font-medium">
            {t("total_days_off_used")}: 13
          </div>
          <div className="text-muted-foreground">
            {t("showing_breakdown_leaves")}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {Object.entries(leaveTypes).map(([key, { label, color }]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm">{t(label)}</span>
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* 2. KALENDAR */}
      <Card>
        <CardContent className="p-0">
          <Calendar
            className="w-full h-full"
            modifiers={groupedDates}
            modifiersClassNames={{
              sick_leave: "bg-yellow-500 text-white rounded",
              paid_time_off: "bg-green-500 text-white rounded",
              personal_leave: "bg-red-500 text-white rounded",
            }}
            components={{
              DayButton: ({ day }) => {
                const matched = dayOffDates.find(
                  (d) => d.date.toDateString() === normalizeDate(day.date).toDateString()
                );

                if (matched) {
                  const { type } = matched;
                  const info = leaveTypes[type];
                  return (
                    <button
                      className={`relative w-full h-full p-1 text-center rounded-md`}
                      style={{
                        backgroundColor: `${info.color}20`,
                        border: `2px solid ${info.color}`,
                      }}
                    >
                      <Badge
                        className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs rounded-full text-white"
                        style={{ backgroundColor: info.color }}
                      >
                        {info.short}
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
