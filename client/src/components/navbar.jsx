import React from "react";
import dummyAvatar from "@/assets/dummy-avatar.png";
import logo from "@/assets/logo.png";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { user, profileImage } = useAuth();

  const userData = user
    ? {
        name: `${user.firstName || ""} 
      ${user.lastName || ""}`.trim(),
        role: user.role || "User",
        avatar: profileImage || dummyAvatar,
      }
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-6 py-2 border-b shadow-sm dark:bg-gray-900">
      {/* Left section - Logo and name */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer"/>
        <img src={logo} alt="Real Estate" className="md:w-8 md:h-8 h-6 w-6 object-contain" />
        <h1 className="md:text-xl text-lg font-bold text-gray-800">Real Estate App</h1>
      </div>

      {/* Right section - Notification + Profile */}
      <div className="flex items-center gap-6">
        <NavUser user={userData} />
      </div>
    </header>
  );
};
