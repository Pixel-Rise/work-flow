import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-language";
import {
  Users,
  MessageCircle,
  CheckCircle,
  GitCommit,
  Upload,
  Clock,
  ArrowRight,
  Activity,
  AlertCircle
} from "lucide-react";
import me from "@/assets/avatar.jpg";

interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar?: string;
    initials: string;
    status: "online" | "offline" | "away";
  };
  type: "task_completed" | "comment" | "file_upload" | "status_change" | "commit" | "meeting_joined";
  description: string;
  timestamp: string;
  project?: string;
  metadata?: {
    taskName?: string;
    fileName?: string;
    commitHash?: string;
    fromStatus?: string;
    toStatus?: string;
  };
}

const sampleActivities: ActivityItem[] = [
  {
    id: 1,
    user: {
      name: "Azizbek Matsalayev",
      avatar: me,
      initials: "AM",
      status: "online"
    },
    type: "task_completed",
    description: "completed task",
    timestamp: "5 min ago",
    project: "SalesFlow",
    metadata: { taskName: "User Authentication System" }
  },
  {
    id: 2,
    user: {
      name: "Ali Karimov",
      initials: "AK",
      status: "online"
    },
    type: "comment",
    description: "commented on",
    timestamp: "12 min ago",
    project: "Digital School",
    metadata: { taskName: "Dashboard UI Design" }
  },
  {
    id: 3,
    user: {
      name: "Laylo Nazarova",
      initials: "LN",
      status: "away"
    },
    type: "file_upload",
    description: "uploaded file",
    timestamp: "25 min ago",
    project: "Legenda Big Fit",
    metadata: { fileName: "wireframes.fig" }
  },
  {
    id: 4,
    user: {
      name: "Bek Saidov",
      initials: "BS",
      status: "offline"
    },
    type: "commit",
    description: "pushed code changes",
    timestamp: "1 hour ago",
    project: "SalesFlow",
    metadata: { commitHash: "a3b2c1d" }
  },
  {
    id: 5,
    user: {
      name: "Malika Tosheva",
      initials: "MT",
      status: "online"
    },
    type: "status_change",
    description: "moved task from",
    timestamp: "2 hours ago",
    project: "Digital School",
    metadata: {
      taskName: "Requirements Analysis",
      fromStatus: "In Progress",
      toStatus: "Review"
    }
  },
  {
    id: 6,
    user: {
      name: "Oybek Yunusov",
      initials: "OY",
      status: "online"
    },
    type: "meeting_joined",
    description: "joined team meeting",
    timestamp: "3 hours ago"
  }
];

const activityIcons = {
  task_completed: { icon: CheckCircle, color: "text-chart-1" },
  comment: { icon: MessageCircle, color: "text-primary" },
  file_upload: { icon: Upload, color: "text-chart-3" },
  status_change: { icon: Activity, color: "text-chart-4" },
  commit: { icon: GitCommit, color: "text-muted-foreground" },
  meeting_joined: { icon: Users, color: "text-chart-5" }
};

const statusDots = {
  online: "bg-chart-1",
  away: "bg-chart-4",
  offline: "bg-muted-foreground"
};

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const t = useTranslation();
  const { icon: Icon, color } = activityIcons[activity.type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
      <div className="relative">
        <Avatar className="w-8 h-8">
          {activity.user.avatar ? (
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
          ) : null}
          <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusDots[activity.user.status]}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-3 h-3 ${color}`} />
          <span className="text-sm font-medium truncate">{activity.user.name}</span>
          <span className="text-xs text-muted-foreground">{t(activity.description)}</span>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          {activity.metadata?.taskName && (
            <div className="flex items-center gap-1">
              <span>"{activity.metadata.taskName}"</span>
            </div>
          )}

          {activity.metadata?.fileName && (
            <div className="flex items-center gap-1">
              <span>{activity.metadata.fileName}</span>
            </div>
          )}

          {activity.metadata?.commitHash && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="px-1 py-0 text-xs">
                {activity.metadata.commitHash}
              </Badge>
            </div>
          )}

          {activity.metadata?.fromStatus && activity.metadata?.toStatus && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="px-1 py-0 text-xs">
                {activity.metadata.fromStatus}
              </Badge>
              <ArrowRight className="w-2 h-2" />
              <Badge variant="outline" className="px-1 py-0 text-xs">
                {activity.metadata.toStatus}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            {activity.project && (
              <span className="text-xs text-muted-foreground">
                in {activity.project}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-2 h-2" />
              <span>{activity.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamActivityFeed() {
  const t = useTranslation();

  const onlineMembers = sampleActivities
    .filter(activity => activity.user.status === "online")
    .length;

  const recentActivities = sampleActivities.slice(0, 6);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-chart-5" />
            {t("team_activity")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-chart-1 rounded-full" />
              <span>{onlineMembers} {t("online")}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              {t("view_all")}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="max-h-64 overflow-y-auto space-y-1">
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>

        {recentActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">{t("no_recent_activity")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}