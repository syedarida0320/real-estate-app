// src/pages/Agent.jsx
import React, { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Plus } from "lucide-react";
import { IconBuildingSkyscraper } from "@tabler/icons-react";
import axios from "@/utils/axios";
import dummyAvatar from "@/assets/dummy-avatar.png";
import { useNavigate } from "react-router-dom";

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();

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

  return (
    <MainLayout>
      <div className="px-4 sm:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="md:text-2xl text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Agents List
          </h2>

          {/* Only Admin can see Add Agent button */}
          {user?.role === "Admin" && (
            <Button
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={() => navigate("/add-agent")}
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
              onClick={() => navigate(`/agent/${agent._id}`)}
              className="flex flex-col p-1 sm:flex-row items-center sm:items-stretch shadow-sm hover:shadow-md transition rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Image Section */}
              <div className="w-full sm:w-60 h-full flex justify-center items-center overflow-hidden rounded-lg">
                <img
                  src={
                    agent.profileImage
                      ? `http://localhost:5000${agent.profileImage}`
                      : dummyAvatar
                  }
                  alt={agent.name || "Agent Avatar"}
                  className="h-40 w-45 sm:h-40 sm:w-48 object-cover rounded-lg transform scale-[1.3] transition-all"
                />
              </div>

              {/* Content Section */}
              <CardContent className="flex flex-col p-0 justify-center w-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {agent.user?.firstName} {agent.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-7">{agent.user?.role}</p>

                  <div className="flex flex-row gap-2 my-2 text-gray-600 text-sm">
                    <div className="flex flex-col md:space-x-20 space-x-5">
                      <p className="flex items-center gap-2">
                        <Mail size={15} className="text-gray-500" />
                        {agent.user?.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={15} className="text-gray-500" />
                        {agent.user?.phone}
                      </p>
                    </div>
                    <div className="flex flex-col md:space-x-20 space-x-5">
                      <p className="flex items-center gap-2">
                        <MapPin size={15} className="text-gray-500" />
                        {agent.user?.address
                      ? Object.values(agent.user?.address).filter(Boolean)
                      : "No location"}
                      </p>
                      <p className="flex items-center gap-2">
                        <IconBuildingSkyscraper
                          size={15}
                          className="text-gray-500"
                        />
                        {agent.totalListings || 0} Properties
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Agent;
