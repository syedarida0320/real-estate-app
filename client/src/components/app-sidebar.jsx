import * as React from "react";
import {
  IconDashboard,
  IconBuildingSkyscraper,
  IconUsers,
  IconMessageDots,
  IconUserCircle,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ClockIcon } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    path: "/home",
    icon: IconDashboard,
    roles: ["Admin"],
  },
  {
    title: "Property",
    path: "/properties",
    icon: IconBuildingSkyscraper,
    roles: ["Admin", "Agent", "User"],
  },
  {
    title: "Agent",
    path: "/agent",
    icon: IconUsers,
    roles: ["Admin"],
  },
  {
    title: "Agent Requests",
    path: "/admin/agent-requests",
    icon: ClockIcon,
    roles: ["Admin"],
  },
  {
    title: "Message",
    path: "/message",
    icon: IconMessageDots,
    roles: ["Admin", "Agent", "User"],
  },
  {
    title: "My Profile",
    path: "/profile",
    icon: IconUserCircle,
    roles: ["Admin", "Agent", "User"],
  },
];

export function AppSidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  return (
    <Sidebar className="bg-white border-r border-gray-200 w-55 h-[calc(100vh-64px)] fixed left-0 top-[64px] shadow-sm">
      <SidebarContent className="flex-1 overflow-y-auto mt-5">
        <SidebarMenu>
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item, idx) => (
              <SidebarMenuItem key={idx}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </NavLink>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
