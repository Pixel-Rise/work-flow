import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useTranslation } from "@/hooks/use-language";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend
} from "recharts";
import { TrendingUp, Activity, Clock, Target } from "lucide-react";

const dailyProductivity = [
  { day: "Mon", productivity: 85, focusTime: 6.5, breaks: 3 },
  { day: "Tue", productivity: 78, focusTime: 5.8, breaks: 4 },
  { day: "Wed", productivity: 92, focusTime: 7.2, breaks: 2 },
  { day: "Thu", productivity: 88, focusTime: 6.8, breaks: 3 },
  { day: "Fri", productivity: 75, focusTime: 5.5, breaks: 5 },
  { day: "Sat", productivity: 95, focusTime: 4.0, breaks: 1 },
  { day: "Sun", productivity: 0, focusTime: 0, breaks: 0 },
];

const taskDistribution = [
  { name: "Development", value: 45, color: "#3B82F6" },
  { name: "Meetings", value: 20, color: "#EF4444" },
  { name: "Planning", value: 15, color: "#10B981" },
  { name: "Testing", value: 12, color: "#F59E0B" },
  { name: "Documentation", value: 8, color: "#8B5CF6" },
];

const weeklyTrend = [
  { week: "W1", productivity: 82, tasks: 28 },
  { week: "W2", productivity: 85, tasks: 32 },
  { week: "W3", productivity: 79, tasks: 25 },
  { week: "W4", productivity: 88, tasks: 35 },
];

const chartConfig: ChartConfig = {
  productivity: {
    label: "Productivity",
    color: "hsl(var(--chart-1))",
  },
  focusTime: {
    label: "Focus Time",
    color: "hsl(var(--chart-2))",
  },
  breaks: {
    label: "Breaks",
    color: "hsl(var(--chart-3))",
  },
};

export function ProductivityChart() {
  const t = useTranslation();

  const currentWeekAvg = dailyProductivity
    .filter(day => day.productivity > 0)
    .reduce((sum, day) => sum + day.productivity, 0) /
    dailyProductivity.filter(day => day.productivity > 0).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Daily Productivity Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {t("daily_productivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="productivity"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{t("average_this_week")}: {Math.round(currentWeekAvg)}%</span>
            <span className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              +5% {t("from_last_week")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Task Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            {t("task_distribution")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Focus Time vs Breaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            {t("focus_vs_breaks")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="focusTime"
                  stroke="#10B981"
                  strokeWidth={2}
                  name={t("focus_hours")}
                />
                <Line
                  type="monotone"
                  dataKey="breaks"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name={t("breaks_count")}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            {t("weekly_trend")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="productivity"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name={t("productivity_percent")}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tasks"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name={t("tasks_completed")}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}