import React, { useState } from "react";
import { User, Settings, LogOut, Moon, ChevronDown, Sun}from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import dummyAvatar from "@/assets/dummy-avatar.png";
import { useTheme } from "@/context/ThemeContext";

export function NavUser({ user }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const {darkMode,toggleDarkMode}=useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditProfile=()=>{
    setOpen(false);
    navigate("/profile", {state:{editing:true}});
  };

  return (
    <div className="relative">
      {/* Profile Section */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        {/* Profile Image */}
        <img
          src={user.avatar || dummyAvatar}
          alt="User"
          className="w-10 h-10 rounded-full object-cover border"
        />

        {/* User Info */}
        <div className="flex flex-col items-start leading-tight">
          <span className="font-semibold text-sm text-gray-800">
            {user.name}
          </span>
          <span className="text-xs text-gray-500">{user.role}</span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          key="dropdown"
          className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg z-50 transition-all duration-300"
        >
          <button onClick={handleEditProfile}
           className="flex items-center w-full gap-3 px-4 py-2 text-sm hover:bg-gray-100">
            <User className="w-4 h-4 text-gray-600" />
            Edit Profile
          </button>

          <button className="flex items-center w-full gap-3 px-4 py-2 text-sm hover:bg-gray-100">
            <Settings className="w-4 h-4 text-gray-600" />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 text-gray-600" />
            Logout
          </button>

          <button onClick={toggleDarkMode}
           className="flex items-center w-full gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
             {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-yellow-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
