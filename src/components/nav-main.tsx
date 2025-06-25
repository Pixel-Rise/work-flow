"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/components/language-provider";
import { Link, useLocation } from "react-router-dom";
import type { Message } from "@/types/message";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  badge?: number;
  items?: {
    title: string;
    url: string;
    icon?: string;
    badge?: number;
    lastMessage?: Message;
  }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const t = useTranslation();
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <Badge  className="size-5 text-xs">
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isActive = pathname === subItem.url;
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className="h-8 items-center gap-2"
                        >
                          <Link
                            to={subItem.url}
                            className="flex items-center gap-2 w-full"
                          >
                            {subItem.badge ? (
                              <>
                                <HoverCard>
                                  <HoverCardTrigger
                                    className={`flex items-center gap-2 w-full ${
                                      isActive
                                        ? "text-primary font-semibold"
                                        : ""
                                    }`}
                                  >
                                    <Avatar className="h-7 w-7 border">
                                      <AvatarImage
                                        src={subItem.icon}
                                        alt={subItem.icon}
                                      />
                                      <AvatarFallback>
                                        {subItem.title[0]}
                                      </AvatarFallback>
                                    </Avatar>

                                    <span className="truncate max-w-[100px] overflow-hidden whitespace-nowrap">
                                      {subItem.title}
                                    </span>
                                  </HoverCardTrigger>

                                  <HoverCardContent className="w-64">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8 border">
                                        <AvatarImage
                                          src={subItem.icon}
                                          alt={subItem.icon}
                                        />
                                        <AvatarFallback>
                                          {subItem.title[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span
                                        className={`text-sm ${
                                          isActive
                                            ? "text-primary font-semibold"
                                            : ""
                                        } font-medium`}
                                      >
                                        {subItem.title}
                                      </span>
                                    </div>
                                    {subItem.lastMessage && (
                                      <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                                        <span className="font-medium">
                                          {subItem.lastMessage.message}
                                        </span>
                                        <span className="ml-2">
                                          {new Date(
                                            subItem.lastMessage.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    )}
                                  </HoverCardContent>
                                </HoverCard>

                                <Badge
                                  
                                  className="ml-auto size-5 text-xs"
                                >
                                  {subItem.badge > 9 ? "9+" : subItem.badge}
                                </Badge>
                              </>
                            ) : (
                              <span
                                className={`truncate max-w-[150px] ${
                                  isActive ? "text-primary font-semibold" : ""
                                } overflow-hidden whitespace-nowrap`}
                              >
                                {subItem.title}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
