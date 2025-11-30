import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { MoreVertical, Mail, Phone, MapPin, Camera } from "lucide-react";
import profileBg from "@/assets/profile-bg.png";
import dummyAvatar from "@/assets/dummy-avatar.png";
import axios from "@/utils/axios";
import MainLayout from "@/layouts/MainLayout";
import { useLocation } from "react-router-dom";
import { SectionCards } from "@/components/section-cards";

function ProfileImage({ userId }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // fetch image with auth token
    axios
      .get(`/users/${userId}/profile-image`, { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
      })
      .catch(() => {
        setImageUrl(dummyAvatar);
      });
  }, [userId]);

  return (
    <img
      src={imageUrl || dummyAvatar}
      alt="Profile"
      className="w-20 h-20 rounded-full object-cover border-1 border-gray-400 bg-white absolute top-2 -right-[35px]"
    />
  );
}

const Profile = () => {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(user || null);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const menuRef = useRef(null);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    email: "",
  });

  // 🟢 Close menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (location.state?.editing) {
      setEditing(true);
    }
  }, [location.state]);

  const fileInputRef = useRef(null);

  // Initialize profile data from localStorage/context
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user?._id) {
          const res = await axios.get(`/users/${user._id}`);
          const fetchedUser = res.data.data || res.data;

          setProfile(fetchedUser);
          setFormData({
            address:
              typeof fetchedUser.address === "string"
                ? fetchedUser.address
                : Object.values(fetchedUser.address || {}).join(", "),
            phone: fetchedUser.phone || "",
            email: fetchedUser.email || "",
          });
          setUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err.message);
      }
    };

    fetchUser();
  }, [user?._id, setUser]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formDataObj = new FormData();
      formDataObj.append("profileImage", file);

      const res = await axios.put(`/users/${profile._id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const savedUser = res.data.data || res.data;
      setProfile(savedUser);
      setUser(savedUser);
      localStorage.setItem("user", JSON.stringify(savedUser));
    } catch (err) {
      console.error("Image upload failed:", err.message);
    }
  };

  // ✅ Save profile directly to DB
  const handleSave = async () => {
    try {
      const updatedUser = {
        address: formData.address,
        phone: formData.phone,
        // email: formData.email,
      };

      const res = await axios.put(`/users/${profile._id}`, updatedUser);
      const savedUser = res.data.data || res.data;

      setProfile(savedUser);
      setUser(savedUser);
      localStorage.setItem("user", JSON.stringify(savedUser));
      setErrors({});
      setEditing(false);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // backend validation errors
      } else {
        console.error("Profile update failed:", err.message);
      }
    }
  };

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <MainLayout>
      <div className="py-1">
        {/* Profile Header */}
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        <Card className="p-6 flex flex-col md:flex-row gap-6 items-start relative">
          {/* 3-dot Menu */}
          <div className="absolute top-4 right-4" ref={menuRef}>
            <button
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <button
                  className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Profile Photo */}
          <div className="relative w-full md:w-1/3">
            <div
              className="w-full h-65 rounded-xl relative"
              style={{
                backgroundImage: `url(${profileBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer absolute bottom-3 left-3 bg-white flex items-center gap-2 text-gray-500"
                onClick={() => fileInputRef.current.click()} // open file picker
              >
                <Camera className="w-4 h-4 text-gray-600" />
                Change Photo
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            <ProfileImage userId={profile?._id} />
          </div>

          {/* User Info */}
          <div className="flex-1 ml-6 mt-12 md:mt-0">
            <h3 className="text-xl font-bold">
              {profile?.firstName} {profile?.lastName}
            </h3>
            <p className="ml-2 text-sm text-gray-500">{profile?.role}</p>

            {editing ? (
              <div className="mt-4 space-y-4">
                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    className="w-full"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    name="email"
                    value={formData.email || ""}
                    disabled
                    className="text-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Save & Cancel Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button className="cursor-pointer" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4 text-gray-700">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{formData.address || "Enter your full address"}</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{formData.phone || "Enter your phone number"}</span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{formData.email || "Enter your email"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        <SectionCards />
      </div>
    </MainLayout>
  );
};
export default Profile;
