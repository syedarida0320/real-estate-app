import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import profileBg from "@/assets/profile-bg.png";
import { MoreVertical, Mail, Phone, MapPin, Camera } from "lucide-react";
import property1 from "@/assets/property-1.jpg"
import property2 from "@/assets/property-2.jpg"
import property3 from "@/assets/property-3.jpg"
import axios from "@/utils/axios";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    email: "",
  });

  const fileInputRef = useRef(null);

  
  // Initialize profile data from localStorage/context
    useEffect(() => {
    const fetchUser = async () => {
      try {
        // console.log("user", user);
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

  //  Upload and save profile image to DB
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const formDataObj = new FormData();

          Object.keys(profile).forEach((key) => {
            formDataObj.append(key, profile[key]);
          });

          formDataObj.append('profileImage', reader.result)

          const res = await axios.put(`/users/${profile._id}`, formDataObj);

          const savedUser = res.data.data || res.data;
          setProfile(savedUser);
          setUser(savedUser);
          localStorage.setItem("user", JSON.stringify(savedUser));
        } catch (err) {
          console.error("Image upload failed:", err.message);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save profile directly to DB
  const handleSave = async () => {
    try {
      const updatedUser = {
        ...profile,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
      };

      const formDataObj = new FormData();

      Object.keys(updatedUser).forEach((key) => {
        formDataObj.append(key, updatedUser[key]);
      });

      const res = await axios.put(`/users/${profile._id}`, formDataObj);

      const savedUser = res.data.data || res.data;
      setProfile(savedUser);
      setUser(savedUser);
      localStorage.setItem("user", JSON.stringify(savedUser));

      setEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err.message);
    }
  };

  if (!profile) return <p className="p-6">Loading...</p>;

 return (
    <div className="p-6">
      {/* Profile Header */}
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <Card className="p-6 flex flex-col md:flex-row gap-6 items-start relative">
        {/* 3-dot Menu */}
        <div className="absolute top-4 right-4">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
              >
                Edit Profile
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                Setting
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
              className="absolute bottom-3 left-3 bg-white flex items-center gap-2 text-gray-500"
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

          <img
            src={profile?.profileImage || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-white absolute top-2 -right-[35px]"
          />
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
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              {/* Save & Cancel Buttons */}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
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

      {/* Property List */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Property List</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              Popular
            </Button>
            <Button size="sm" variant="ghost">
              Recommended
            </Button>
            <Button size="sm" variant="ghost">
              Newest
            </Button>
            <Button size="sm" variant="ghost">
              Most Recent
            </Button>
          </div>
        </div>

        {/* Example static properties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent>
              <img
                src={property1}
                alt="property"
                className="w-full h-40 object-cover rounded-lg"
              />
              <h4 className="mt-3 font-semibold">Star Sun Hotel & Apartment</h4>
              <p className="text-sm text-gray-500">North Carolina, USA</p>
              <span className="text-blue-600 font-bold">$500</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <img
                src={property2}
                alt="property"
                className="w-full h-40 object-cover rounded-lg"
              />
              <h4 className="mt-3 font-semibold">Letdo Ji Hotel & Apartment</h4>
              <p className="text-sm text-gray-500">New York City, USA</p>
              <span className="text-blue-600 font-bold">$500</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <img
                src={property3}
                alt="property"
                className="w-full h-40 object-cover rounded-lg"
              />
              <h4 className="mt-3 font-semibold">Metro Jayakar Apartment</h4>
              <p className="text-sm text-gray-500">North Carolina, USA</p>
              <span className="text-blue-600 font-bold">$500</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Profile;
