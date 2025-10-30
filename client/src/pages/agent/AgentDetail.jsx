import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import axios from "@/utils/axios";
import { Mail, Phone, MapPin, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import dummyAvatar from "@/assets/dummy-avatar.png";
import agentBg from "@/assets/agent-bg.png";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const AgentDetail = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(`/agents/${id}`);
        setAgent(res.data.data);
      } catch (error) {
        console.error("Error fetching agent details:", error);
      }
    };
    fetchAgent();
  }, [id]);

  if (!agent)
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[80vh] text-gray-500">
          Loading agent details...
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        {/* Agent Profile Section */}
        <Link
          to="/agent"
          className="text-2xl mb-0 flex space-x-3 text-black font-medium p-4"
        >
          <ChevronLeft className="w-7 h-7" />
          <h1>Details</h1>
        </Link>
        <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row gap-8 px-8 py-4">
          {/* Left Profile Card */}
          <div className="flex flex-col  md:w-1/3 border-r border-gray-100 pr-8">
            <div className="relative w-full h-48 flex items-center justify-center">
              {/* Background image */}
              <img
                src={agentBg}
                alt="Profile background"
                className="absolute rounded-[10px] inset-0 w-full h-full object-cover opacity-90"
              />

              {/* Foreground (profile) image */}
              <img
                src={
                  agent.profileImage
                    ? `http://localhost:5000${agent.profileImage}`
                    : dummyAvatar
                }
                alt="Agent"
                className=" relative top-20 w-25 h-25 rounded-full object-cover border-1 -right-20 border-white shadow-md"
              />
            </div>
            <div className="flex flex-col mb-4 items-start">
              <h2 className="text-xl font-semibold mt-1 text-[16px]">{agent.name}</h2>
              <p className="text-gray-500 text-[14px]">{agent.role}</p>
            </div>
            <div className="mt-1 space-y-2 text-sm text-gray-600 w-full">
              <p>Age: {agent.age || "N/A"}</p>
              <p>City: {agent.city || "N/A"}</p>
              <p>State: {agent.state || "N/A"}</p>
              <p>Country: {agent.country || "N/A"}</p>
              <p>Post Code: {agent.postCode || "N/A"}</p>
              <p>Agent ID: {agent.agentId || "N/A"}</p>
              <p className="flex items-center gap-2">
                <Phone size={14} /> {agent.phone || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} /> {agent.email || "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {agent.socialLinks?.facebook && (
                <a
                  href={agent.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-blue-600 text-xl hover:scale-110 transition" />
                </a>
              )}
              {agent.socialLinks?.twitter && (
                <a
                  href={agent.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-sky-500 text-xl hover:scale-110 transition" />
                </a>
              )}
              {agent.socialLinks?.instagram && (
                <a
                  href={agent.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-pink-500 text-xl hover:scale-110 transition" />
                </a>
              )}
            </div>
          </div>

          {/* Right Detail Card */}
          <div className="flex-1 space-y-6">
            {/* Bio */}
            <Card className="p-5 shadow-sm">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Agent Details</h3>
                <p className="text-gray-600 text-[16px]">{agent.bio || ""}</p>

                <div className="flex flex-col gap-4 mt-4 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Agency:</span>{" "}
                    {agent.agency || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Agent License:</span>{" "}
                    {agent.agentLicense || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Tax Number:</span>{" "}
                    {agent.taxNumber || "N/A"}
                  </p>
                  <p className="col-span-2 sm:col-span-3">
                    <span className="font-medium">Service Area:</span>{" "}
                    {agent.serviceAreas?.join(", ") || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Cards */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold mb-2">Agent Status</h3>
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-5 text-center">
                  <p className="text-gray-500 text-[16px]">Total Listings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {agent.totalListings}
                  </p>
                </Card>
                <Card className="p-5 text-center">
                  <p className="text-gray-500 text-[16px]">Properties Sold</p>
                  <p className="text-2xl font-bold text-green-600">
                    {agent.propertiesSold}
                  </p>
                </Card>
                <Card className="p-5 text-center">
                  <p className="text-gray-500 text-[16px]">Properties Rented</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {agent.propertiesRented}
                  </p>
                </Card>
              </div>
            </div>

            {/* Active Listings */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">Active Listings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {agent.activeListings?.length > 0 ? (
                  agent.activeListings.map((property) => (
                    <div
                      key={property._id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={property.images?.[0] || "/placeholder.jpg"}
                        alt={property.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3 text-sm text-gray-600">
                        <p className="font-medium text-gray-800">
                          {property.title}
                        </p>
                        <p className="flex items-center gap-2 text-gray-500">
                          <MapPin size={13} /> {property.location}
                        </p>
                        <p className="text-blue-600 font-semibold mt-1">
                          ${property.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No active listings yet.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AgentDetail;
