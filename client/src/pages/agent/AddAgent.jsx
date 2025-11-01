// src/pages/AddAgent.jsx
import React, { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import axios from "@/utils/axios";
import dummyAvatar from "@/assets/dummy-avatar.png";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AddAgent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    role: "Agent",
    age: "",
    city: "",
    state: "",
    country: "",
    postCode: "",
    phone: "",
    email: "",
    agency: "",
    agentLicense: "",
    taxNumber: "",
    serviceAreas: "",
    bio: "",
    totalListings: "",
    propertiesSold: "",
    propertiesRented: "",
    facebook: "",
    twitter: "",
    instagram: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      await axios.post("/agents", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Agent added successfully!");
      navigate("/agent");
    } catch (error) {
      console.error("Error adding agent:", error);
      alert("Failed to add agent.");
    }
  };

  const handleBack = () => {
    navigate("/agent");
  };

  return (
    <MainLayout>
      <div className="px-4 sm:px-8 py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Add New Agent
          </h2>
        </div>

        {/* Gradient Header */}
        <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl mb-10 relative">
          <div className="absolute -bottom-10 left-6">
            <img
              src={
                formData.profileImage
                  ? URL.createObjectURL(formData.profileImage)
                  : dummyAvatar
              }
              alt="Profile Preview"
              className="w-20 h-20 rounded-full mb-2 object-cover border bg-white border-gray-300 shadow-md"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="border p-2 rounded w-full"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className=" block text-gray-600 text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                className="border p-2 w-full rounded"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                className="border w-full p-2 rounded"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                className="border w-full p-2 rounded"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="border p-2 w-full rounded"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Post Code</label>
              <input
                type="text"
                name="postCode"
                placeholder="Post Code"
                className="border p-2 w-full rounded"
                value={formData.postCode}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="border p-2 w-full rounded"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 w-full rounded"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Agency Name</label>
              <input
                type="text"
                name="agency"
                placeholder="Agency Name"
                className="border p-2 w-full rounded"
                value={formData.agency}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Agent License</label>
              <input
                type="text"
                name="agentLicense"
                placeholder="Agent License"
                className="border p-2 w-full rounded"
                value={formData.agentLicense}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Tax Number</label>
              <input
                type="text"
                name="taxNumber"
                placeholder="Tax Number"
                className="border p-2 w-full rounded"
                value={formData.taxNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Service Areas</label>
              <input
                type="text"
                name="serviceAreas"
                placeholder="Service Areas"
                className="border p-2 w-full rounded"
                value={formData.serviceAreas}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Total Listings</label>
              <input
                type="number"
                name="totalListings"
                placeholder="Total Listings"
                className="border p-2 w-full rounded"
                value={formData.totalListings}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Properties Sold
              </label>
              <input
                type="number"
                name="propertiesSold"
                placeholder="Properties Sold"
                className="border p-2 w-full rounded"
                value={formData.propertiesSold}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Properties Rented
              </label>
              <input
                type="number"
                name="propertiesRented"
                placeholder="Properties Rented"
                className="border p-2 w-full rounded"
                value={formData.propertiesRented}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Agent Bio</label>
            <textarea
              name="bio"
              placeholder="Agent Bio"
              className="border p-2 rounded w-full"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Facebook URL</label>
              <input
                type="text"
                name="facebook"
                placeholder="Facebook URL"
                className="border p-2 w-full rounded"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Twitter URL</label>
              <input
                type="text"
                name="twitter"
                placeholder="Twitter URL"
                className="border p-2 w-full rounded"
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Instagram URL</label>
              <input
                type="text"
                name="instagram"
                placeholder="Instagram URL"
                className="border p-2 w-full rounded"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              id="profileUpload"
            />
            <label
              htmlFor="profileUpload"
              className="cursor-pointer block text-gray-600 text-sm font-medium mb-1"
            >
              Click to upload or drag and drop
              <br />
              <span className="text-sm text-gray-400">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick= {handleBack}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">
              Save Agent
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddAgent;
