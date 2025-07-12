"use client"
import * as React from "react"
import { useEffect, useState } from "react";
import { getUserName, getUserEmail, getUserImage, API_BASE_IMG, getUserNick } from "@/lib/global";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { sidebarData } from "@/lib/data/sidebar-data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({
  data,
  ...props
}) {
  const [user, setUser] = useState(sidebarData.user);

  useEffect(() => {
    let avatar = getUserImage() || "/logo.jpg";
    if (avatar && !avatar.startsWith("http")) {
      avatar = API_BASE_IMG.replace(/\/$/, "") + avatar;
    }
    setUser({
      name: getUserNick() || "",
      email: getUserEmail() || "",
      avatar,
    });
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} name={sidebarData.appInfo.name} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
{/*         <NavProjects projects={sidebarData.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
