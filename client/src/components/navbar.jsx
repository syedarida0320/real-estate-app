import React,{useEffect, useState} from "react";
import dummyAvatar from "@/assets/dummy-avatar.png";
import logo from "@/assets/logo.png";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useAuth } from "@/context/AuthContext";
import axios from "@/utils/axios"


export const Navbar = () => {
  const {user}=useAuth();
  const [profileImage, setProfileImage]=useState(dummyAvatar);

useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(`/users/${user._id}/profile-image`, {
          responseType: "blob",
        });
        const imgUrl = URL.createObjectURL(res.data);
        setProfileImage(imgUrl);
       // console.log("here in navbar => ", res.data);
      } catch (error) {
        console.error("Failed to fetch profile image:", error.message);
        setProfileImage(dummyAvatar);
      }
    };

    fetchProfileImage();
  }, [user?._id]);

  const userData=user
    ?{
      name:`${user.firstName || ""} 
      ${user.lastName || ""}`.trim(), 
      role:user.role || "User",
    avatar: profileImage,
  }
    :null;
     
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-6 py-2 border-b shadow-sm   dark:bg-gray-900">
      {/* Left section - Logo and name */}
      <div className="flex items-center gap-2">
        <SidebarTrigger/>
        <img src={logo} alt="Yariga Logo" className="w-8 h-8 object-contain" />
        <h1 className="text-xl font-bold text-gray-800">Yariga</h1>
      </div>

      {/* Center section - Search */}
      <div className="flex items-center gap-3 w-full max-w-lg mx-6">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Property, Customer, etc..."
          className="w-full border-none focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Right section - Notification + Profile */}
      <div className="flex items-center gap-6">
        <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500" />
         <NavUser user={userData}/>
        </div>
    </header>
  );
};
