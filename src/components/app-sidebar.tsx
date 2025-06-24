import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  School,
  ShoppingCart,
  Dumbbell,
  MessageSquareText,
  Settings2,
} from "lucide-react"
import { useTranslation } from "@/components/language-provider";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import  Avatar from "@/assets/avatar.jpg"
import  TeamAvatar from "@/assets/it-forelead.jpg"

import type { Message } from "@/types/message"

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
        title: t("playground"),
        url: "#",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: t("dashboard"),
            url: "/",
          },
          {
            title: t("projects"),
            url: "/projects",
          },
          {
            title: t("reports"),
            url: "/reports",
          },
          {
            title: t("dayoff"),
            url: "/days-off",
          },
        ],
      },
      {
        title: t("chats"),
        url: "#",
        icon: MessageSquareText,
        badge: 10,
        items: [
          {
            title: "Azizbek Matsalayev",
            url: "#",
            icon: Avatar,
            badge: 1,
            lastMessage: {
              message: "Hello, how are you?",
              createdAt: new Date("2023-10-01T12:00:00Z"),
            } as Message,
          },
          {
            title: "John Doe",
            url: "#",
            badge: 4,
            lastMessage: {
              message: "Let's catch up later.",
              createdAt: new Date("2023-10-01T11:30:00Z"),
            } as Message,
          },
          {
            title: "Jane Smith",
            url: "#",
            badge: 2,
            lastMessage: {
              message: "Did you receive my last email?",
              createdAt: new Date("2023-10-01T10:45:00Z"),
            } as Message,
          },
          {
            title: "Michael Johnson",
            url: "#",
            badge: 3,
            lastMessage: {
              message: "Can we reschedule our meeting?",
              createdAt: new Date("2023-10-01T09:15:00Z"),
            } as Message,
          },
        ],
      },
      {
        title: t("documentation"),
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: t("introduction"),
            url: "#",
          },
          {
            title: t("get_started"),
            url: "#",
          },
          {
            title: t("tutorials"),
            url: "#",
          },
          {
            title: t("changelog"),
            url: "#",
          },
        ],
      },
      {
        title: t("settings"),
        url: "#",
        icon: Settings2,
        items: [
          {
            title: t("general"),
            url: "#",
          },
          {
            title: t("team"),
            url: "#",
          },
          {
            title: t("billing"),
            url: "#",
          },
          {
            title: t("limits"),
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Digital School",
        url: "#",
        icon: School,
      },
      {
        name: "SalesFlow",
        url: "#",
        icon: ShoppingCart,
      },
      {
        name: "Legenda Big Fit",
        url: "#",
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
