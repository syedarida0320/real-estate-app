import { createContext, useContext, useState,useEffect, useMemo } from "react";
import axios from "@/utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
const [profileImage, setProfileImage]=useState(null);

// ✅ Fetch profile image only once (when user logs in or app reloads)
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/users/${user._id}/profile-image`, {
          responseType: "blob",
        });
        const imgUrl = URL.createObjectURL(res.data);
        setProfileImage(imgUrl);
      } catch (error) {
        console.error("Failed to fetch profile image:", error.message);
      }
    };

    fetchProfileImage();
  }, [user?._id]);

  // Login (called from Login.jsx)
  const loginUser = ({ user, token }) => {
    setUser(user);
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  //  Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value=useMemo(
    ()=> ({user, loginUser,logout,setUser, profileImage, setProfileImage}),
    [user, profileImage]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
