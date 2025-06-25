import React, { useEffect, useState } from "react";
import { useTranslation } from "@/components/language-provider";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { Clock } from "lucide-react";
import { usePrimaryColor } from "@/components/primary-color-provider";

const HomePage: React.FC = () => {
  const t = useTranslation();

  const chartData = [
    { weekday: t("monday"), hour: 8 },
    { weekday: t("tuesday"), hour: 6 },
    { weekday: t("wednesday"), hour: 7 },
    { weekday: t("thursday"), hour: 6 },
    { weekday: t("friday"), hour: 10 },
    { weekday: t("saturday"), hour: 0.3 },
    { weekday: t("sunday"), hour: 0.1 },
  ];

  // Assuming you have a theme or color provider, e.g. useTheme or similar
  const { primaryColor } = usePrimaryColor();

  const chartConfig = {
    desktop: {
      label: "Hours",
      color: primaryColor,
    },
  } satisfies ChartConfig;

  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("default", { month: "long" });
  const weekday = now.toLocaleString("default", { weekday: "long" });

  const formattedMonth =
    month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  const formattedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();

  const [time, setTime] = useState(() =>
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalHours = chartData.reduce((acc, item) => acc + item.hour, 0).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chap ustun: Sana va vaqt */}
        <div className="flex flex-col justify-between items-center lg:items-start text-center lg:text-left gap-4">
          <div className="uppercase tracking-wide text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">
            {t("today")}
          </div>
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary/80 to-primary/30 bg-clip-text text-transparent">
            {day}-{formattedMonth.toUpperCase()}
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium bg-gradient-to-r from-primary/60 to-primary/20 bg-clip-text text-transparent">
            {formattedWeekday}
          </div>
          <div className="text-4xl sm:text-5xl lg:text-6xl font-mono mt-2 bg-gradient-to-r from-primary/40 to-primary/10 bg-clip-text text-transparent">
            {time}
          </div>
        </div>

        {/* O‘ng ustun: Statistik ma'lumotlar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-muted/40 border rounded-xl px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              <span className="text-base sm:text-lg font-medium">
                {t("weekly_work_hours")}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary">
              {totalHours} h
            </div>
          </div>

          <ChartContainer config={chartConfig} className="w-full border rounded-2xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="weekday"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString().slice(0,3)}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => `${value} h`}
                />
                <Bar dataKey="hour" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
