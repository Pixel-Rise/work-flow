import { useTranslation } from "@/hooks/use-language";
import { usePageTitle } from "@/hooks/use-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import {
  Briefcase,
  Pause,
  Play,
  CalendarIcon,
  Building,
  HouseWifi,
  Square,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { toast } from "@/hooks/use-toast";

type WorkMode = "on_office" | "remote";

const taskList = [
  { id: 1, title: "Build user dashboard", status: "in_progress" },
  { id: 2, title: "Fix login issue", status: "todo" },
  { id: 3, title: "Write unit tests", status: "in_progress" },
];

export default function HomePage() {
  const t = useTranslation();
  usePageTitle(t("dashboard"));

  const [isWorking, setIsWorking] = useState(false);
  const [workMode, setWorkMode] = useState<WorkMode | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [isPaused, setIsPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [showPauseDialog, setShowPauseDialog] = useState(false);

  // Time range filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 20), // 20 June 2025
    to: new Date(2025, 5, 28), // 28 June 2025
  });
  const [totalWorkedSeconds, setTotalWorkedSeconds] = useState<number>(0);
  const [savedWorkSessions, setSavedWorkSessions] = useState<
    Array<{ date: Date; seconds: number }>
  >([
    { date: new Date(2025, 5, 20), seconds: 28800 }, // 8 soat
    { date: new Date(2025, 5, 21), seconds: 25200 }, // 7 soat
    { date: new Date(2025, 5, 24), seconds: 32400 }, // 9 soat
    { date: new Date(2025, 5, 25), seconds: 21600 }, // 6 soat
    { date: new Date(2025, 5, 26), seconds: 18000 }, // 5 soat
  ]);

  // Calculate total worked time in selected date range
  const getTotalWorkedInRange = () => {
    if (!dateRange?.from || !dateRange?.to) {
      return savedWorkSessions.reduce(
        (sum, session) => sum + session.seconds,
        0
      );
    }

    const filteredSessions = savedWorkSessions.filter((session) => {
      const sessionDate = session.date;
      return sessionDate >= dateRange.from! && sessionDate <= dateRange.to!;
    });

    return filteredSessions.reduce((sum, session) => sum + session.seconds, 0);
  };
  // Chart data
  const chartData = [
    { weekday: t("monday"), hour: 8 },
    { weekday: t("tuesday"), hour: 7 },
    { weekday: t("wednesday"), hour: 8 },
    { weekday: t("thursday"), hour: 6 },
    { weekday: t("friday"), hour: 5 },
    { weekday: t("saturday"), hour: 0 },
    { weekday: t("sunday"), hour: 0 },
  ];

  const chartConfig: ChartConfig = {
    desktop: {
      label: "Hours",
      color: "hsl(var(--primary))",
    },
  };

  useEffect(() => {
    if (isWorking && !isPaused) {
      const interval = setInterval(() => {
        if (startTime) {
          const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
          const h = String(Math.floor(diff / 3600)).padStart(2, "0");
          const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
          const s = String(diff % 60).padStart(2, "0");
          setElapsed(`${h}:${m}:${s}`);
          setTotalWorkedSeconds(diff);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isWorking, startTime, isPaused]);

  const handleStartWork = (mode: WorkMode) => {
    setWorkMode(mode);
    const now = new Date();
    setStartTime(now);
    setIsWorking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setShowPauseDialog(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setPauseReason("");
  };

  const handleStop = () => {
    // Agar ish qilingan bo'lsa, uni saved sessions ga qo'shish
    if (isWorking && startTime && totalWorkedSeconds > 0) {
      const newSession = {
        date: new Date(), // Bugungi sana
        seconds: totalWorkedSeconds,
      };
      setSavedWorkSessions((prev) => [...prev, newSession]);
    }

    setIsWorking(false);
    setIsPaused(false);
    setWorkMode(null);
    setStartTime(null);
    setElapsed("00:00:00");
    setPauseReason("");
    setTotalWorkedSeconds(0); // Current session ni tozalash
  };

  const formatDuration = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatDateRange = () => {
    if (!dateRange?.from && !dateRange?.to) {
      return t("filter_by_date_range");
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    if (dateRange?.from && dateRange?.to) {
      return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
    } else if (dateRange?.from) {
      return formatDate(dateRange.from);
    }

    return t("filter_by_date_range");
  };

  return (
    <div className="space-y-3">
      {/* Working Card with Date Range Filter */}
      <Card className="p-6">
        <CardHeader className="grid lg:grid-cols-2 justify-center gap-3">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <Briefcase className="w-6 h-6" />
            <CardTitle className="text-2xl">{t("working")}</CardTitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-auto" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {formatDateRange()}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("filter_by_date_range")}</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  className="rounded-lg w-full shadow-sm"
                />
              </div>
              <Button className="ml-4">{t("use_filters")}</Button>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Total Worked Time */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              {t("total_worked")}
            </div>
            <div className="text-4xl font-mono font-bold text-primary">
              {formatDuration(getTotalWorkedInRange())}
            </div>
          </div>

          {/* Current Session */}
          {isWorking && (
            <div className="text-center space-y-3 p-3 border rounded-lg bg-muted/20">
              <div className="flex justify-center items-center gap-3">
                <Badge variant={isPaused ? "outline" : "default"}>
                  {isPaused ? t("paused") : t("active")}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {workMode && t(workMode)}
                </span>
              </div>
              <div className="text-3xl font-mono font-bold text-primary">
                {elapsed}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-2">
            {!isWorking ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="px-8">
                    <Play className="w-5 h-5 mr-2" />
                    {t("start_work")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("choose_work_mode")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => handleStartWork("on_office")}
                      className="flex flex-col justify-center items-center border-2 rounded-lg p-8 hover:bg-muted cursor-pointer hover:border-primary transition-colors"
                    >
                      <Building size={80} className="mb-4" />
                      <Label className="text-center font-medium">
                        {t("on_office")}
                      </Label>
                    </div>
                    <div
                      onClick={() => handleStartWork("remote")}
                      className="flex flex-col justify-center items-center border-2 rounded-lg p-8 hover:bg-muted cursor-pointer hover:border-primary transition-colors"
                    >
                      <HouseWifi size={80} className="mb-4" />
                      <Label className="text-center font-medium">
                        {t("remote")}
                      </Label>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <>
                {isPaused ? (
                  <div className="flex gap-3">
                    <Button onClick={handleResume} size="lg" className="px-8">
                      <Play className="w-5 h-5 mr-2" />
                      {t("resume")}
                    </Button>
                    <Button
                      onClick={handleStop}
                      variant="destructive"
                      size="lg"
                      className="px-8"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      {t("stop")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePause}
                      size="lg"
                      className="px-8"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      {t("pause")}
                    </Button>
                    <Button
                      onClick={handleStop}
                      variant="destructive"
                      size="lg"
                      className="px-8"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      {t("stop")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Toast Demo Card */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Toast Notifications Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => toast.success("Muvaffaqiyat!", "Sizning amalingiz muvaffaqiyatli bajarildi.")}
              variant="default"
            >
              Success Toast
            </Button>
            <Button
              onClick={() => toast.error("Xatolik!", "So'rovingizda nimadir noto'g'ri ketdi.")}
              variant="destructive"
            >
              Error Toast
            </Button>
            <Button
              onClick={() => toast.warning("Ogohlantirish!", "Davom etishdan oldin ma'lumotlaringizni tekshiring.")}
              variant="outline"
            >
              Warning Toast
            </Button>
            <Button
              onClick={() => toast.info("Ma'lumot!", "Bu sizga foydali ma'lumot.")}
              variant="secondary"
            >
              Info Toast
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => {
                const promise = new Promise((resolve, reject) => {
                  setTimeout(() => {
                    Math.random() > 0.5 ? resolve("Success!") : reject(new Error("Failed!"))
                  }, 2000)
                })
                
                toast.promise(promise, {
                  loading: "Yuklanmoqda...",
                  success: "Muvaffaqiyatli yuklandi!",
                  error: "Yuklashda xatolik yuz berdi!"
                })
              }}
              variant="outline"
            >
              Promise Toast
            </Button>
            
            <Button
              onClick={() => {
                const toastId = toast.loading("Uzun jarayon boshlanmoqda...")
                setTimeout(() => {
                  toast.dismiss(toastId)
                  toast.success("Jarayon yakunlandi!")
                }, 3000)
              }}
              variant="outline"
            >
              Loading Toast
            </Button>

            <Button
              onClick={() => {
                toast.custom(
                  <div className="flex items-center gap-2 p-2">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <div className="font-semibold">Maxsus xabar!</div>
                      <div className="text-sm text-muted-foreground">Bu custom toast misoli</div>
                    </div>
                  </div>
                )
              }}
              variant="outline"
            >
              Custom Toast
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("pause_reason")}</DialogTitle>
          </DialogHeader>
          <Select onValueChange={(val) => setPauseReason(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("select_reason")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lunch">{t("lunch")}</SelectItem>
              <SelectItem value="break">{t("break")}</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={t("custom_reason")}
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
          />
          <Button onClick={() => setShowPauseDialog(false)}>
            {t("confirm")}
          </Button>
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-2  gap-3">
        {/* Assigned tasks */}
        <Card>
          <CardHeader>
            <CardTitle>{t("your_tasks")}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3">
            {taskList.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center p-2 rounded border hover:bg-muted"
              >
                <div className="text-sm font-medium">{task.title}</div>
                <Badge
                  variant={
                    task.status === "in_progress" ? "default" : "outline"
                  }
                >
                  {t(task.status)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("weekly_work_hours")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="weekday"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => String(value).slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Bar dataKey="hour" radius={4} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
