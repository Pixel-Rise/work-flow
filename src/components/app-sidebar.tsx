import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  School,
  ShoppingCart,
  Dumbbell,
  MessageSquareText,
  Umbrella,
  ChartBarBig
} from "lucide-react"
import { useTranslation } from "@/components/language-provider";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import  Avatar from "@/assets/avatar.jpg"
import  TeamAvatar from "@/assets/it-forelead.jpg"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t  = useTranslation();

  const data = {
    user: {
      name: "Azizbek",
      email: "matsalayev@outlook.com",
      avatar: Avatar,
    },
    teams: [
      {
        name: "IT Forelead",
        logo: TeamAvatar,
        plan: "LTC",
      },
    ],
    navMain: [
      {
        title: t("dashboard"),
        url: "/",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: t("projects"),
        url: "/projects",
        icon: BookOpen,
      },
      {
        title: t("reports"),
        url: "/reports",
        icon: ChartBarBig,
      },
      {
        title: t("dayoff"),
        url: "/days-off",
        icon: Umbrella,
      },
      {
        title: t("chats"),
        url: "/chats",
        icon: MessageSquareText,
        badge: 10,
      }
    ],
    projects: [
      {
        name: "Digital School",
        url: "/tasks/1",
        icon: School,
      },
      {
        name: "SalesFlow",
        url: "/tasks/2",
        icon: ShoppingCart,
      },
      {
        name: "Legenda Big Fit",
        url: "/tasks/3",
        icon: Dumbbell,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
