// src/pages/Agent.jsx
import React, { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Plus, X } from "lucide-react";
import { IconBuildingSkyscraper } from "@tabler/icons-react";
import axios from "@/utils/axios";
import dummyAvatar from "@/assets/dummy-avatar.png";

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    country: "",
    properties: "",
    profileImage: null,
  });

  // Assuming user info is stored in localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("/agents");
        setAgents(res.data.data);
      } catch (error) {
        console.error("Error fetching agents", error);
      }
    };
    fetchAgents();
  }, []);

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
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding agent:", error);
      alert("Failed to add agent.");
    }
  };

  return (
    <MainLayout>
      <div className="px-4 sm:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Agents List
          </h2>

          {/* Only Admin can see Add Agent */}
          {user?.role === "Admin" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 text-white" /> Add Agent
            </Button>
          )}
        </div>

        {/* Agents List */}
        <div className="space-y-5">
          {agents.map((agent) => (
            <Card
              key={agent._id}
              className="flex flex-col p-1 sm:flex-row items-center sm:items-stretch shadow-sm hover:shadow-md transition rounded-xl overflow-hidden"
            >
              {/* Image Section */}
              <div
                className={`w-full sm:w-60 h-full flex justify-center items-center overflow-hidden rounded-lg`}
              >
                <img
                  src={`http://localhost:5000${agent.profileImage}: dummyAvatar`}
                  alt={agent.name}
                  className="h-40 w-45 sm:h-40 sm:w-48 object-cover rounded-lg transform scale-[1.3] transition-all"
                />
              </div>

              {/* Content Section */}
              <CardContent className="flex flex-col p-0 justify-center w-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-7">{agent.role}</p>

                  <div className="flex flex-row gap-2 my-2  text-gray-600 text-sm">
                    <div className="flex flex-col space-x-20">
                      <p className="flex items-center gap-2">
                        <Mail size={15} className="text-gray-500" />
                        {agent.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={15} className="text-gray-500" />
                        {agent.phone}
                      </p>
                        <p className="text-sm text-gray-500">
                        {agent.gender && `Gender: ${agent.gender}`}
                      </p>
                    </div>
                    <div className="flex flex-col space-x-20">
                      <p className="flex items-center gap-2">
                        <MapPin size={15} className="text-gray-500" />
                        {agent.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <IconBuildingSkyscraper
                          size={15}
                          className="text-gray-500"
                        />
                        {agent.properties} Properties
                      </p>
                    
                      <p className="text-sm text-gray-500">
                        {agent.dateOfBirth && `DOB: ${agent.dateOfBirth}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Agent Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[95%] sm:w-[700px] lg:w-[850px] max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Agent</h2>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setShowForm(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Gradient Header */}
            <div className="w-full h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl mb-10 relative">
              <div className="absolute -bottom-10 left-6">
                {formData.profileImage && (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full mb-2 object-cover"
                  />
                )}
              </div>
            </div>

            {/* Form Fields */}
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="dateOfBirth"
                placeholder="Date of Birth"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <select
                name="gender"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="number"
                name="properties"
                placeholder="Properties"
                onChange={handleChange}
                className="border rounded-lg p-2 w-full"
              />

              {/* Image Upload */}
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
                  className="cursor-pointer text-gray-500"
                >
                  Click to upload or drag and drop
                  <br />
                  <span className="text-sm text-gray-400">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 text-white">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Agent;
