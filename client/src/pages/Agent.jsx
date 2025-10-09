import React, { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Plus } from "lucide-react";
import { IconBuildingSkyscraper } from "@tabler/icons-react";
import axios from "@/utils/axios";

const Agent = () => {
  const [agents, setAgents] = useState([]);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Agents List
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-white" /> Add Agent
          </Button>
        </div>

        {/* Agents List */}
        <div className="space-y-5">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="flex flex-col p-1 sm:flex-row items-center sm:items-stretch shadow-sm hover:shadow-md transition rounded-xl overflow-hidden"
            >
              {/* Image Section */}

              <div
                className={`w-full sm:w-60 h-full flex justify-center items-center  overflow-hidden ${agent.bgColor} rounded-lg`}
              >
                <img
                  src={`http://localhost:5000${agent.image}`}
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

                  <div className="flex flex-row gap-2 text-gray-600 text-sm">
                    <div className="flex flex-col space-x-20">
                      <p className="flex items-center gap-2">
                        <Mail size={15} className="text-gray-500" />
                        {agent.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={15} className="text-gray-500" />
                        {agent.phone}
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
