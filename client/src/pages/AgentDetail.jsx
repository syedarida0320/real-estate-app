// src/pages/AgentDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import axios from "@/utils/axios";
import { Mail, Phone, MapPin, Home, Building2 } from "lucide-react";
import { IconLicense, IconFileInvoice, IconMapPin } from "@tabler/icons-react";

const AgentDetail = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(`/agents/${id}`);
        setAgent(res.data.data);
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };
    fetchAgent();
  }, [id]);

  if (!agent) return <div className="text-center py-10">Loading...</div>;

  return (
    <MainLayout>
      <div className="px-4 sm:px-8 py-8 bg-gray-50 min-h-screen">
        {/* Main Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Profile Section */}
          <Card className="w-full lg:w-1/3 p-6 shadow-md">
            <div className="flex flex-col items-center text-center">
              <img
                src={
                  agent.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt={agent.name}
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{agent.name}</h2>
              <p className="text-gray-500 mb-4">{agent.role || "Agent"}</p>

              <div className="text-sm space-y-1 text-gray-600 w-full text-left">
                <p>
                  <strong>Age:</strong> {agent.age || "26"}
                </p>
                <p>
                  <strong>City:</strong> {agent.city || "New York City"}
                </p>
                <p>
                  <strong>State:</strong> {agent.state || "New York"}
                </p>
                <p>
                  <strong>Country:</strong> {agent.country || "USA"}
                </p>
                <p>
                  <strong>Post Code:</strong> {agent.postCode || "1001"}
                </p>
                <p>
                  <strong>Agent ID:</strong> #{agent.agentId || "18457 865 8745"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={15} /> {agent.phone || "+021 541 236 4580"}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={15} /> {agent.email || "hussain145@gmail.com"}
                </p>
              </div>

              <div className="flex gap-3 mt-4 text-gray-500">
                <i className="fab fa-facebook"></i>
                <i className="fab fa-twitter"></i>
                <i className="fab fa-instagram"></i>
              </div>
            </div>
          </Card>

          {/* Right Info Section */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Agent Details Card */}
            <Card className="p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Agent Details</h3>
              <p className="text-gray-600 text-sm mb-5">
                Talent customers tend to earn a basic salary in the range of
                £15,000 to £35,000 per annum. However, talented customers also
                earn a commission for finding their client’s work. Typically,
                agents receive around 10% of what the client is paid.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" />
                  <strong>Agency:</strong> All American Real Estate
                </p>
                <p className="flex items-center gap-2">
                  <IconLicense size={16} className="text-blue-600" />
                  <strong>Agent License:</strong> 3124 9764 9700 234
                </p>
                <p className="flex items-center gap-2">
                  <IconFileInvoice size={16} className="text-blue-600" />
                  <strong>Tax Number:</strong> TX 8760 678H P045
                </p>
                <p className="flex items-center gap-2">
                  <IconMapPin size={16} className="text-blue-600" />
                  <strong>Service Area:</strong> Chicago, Los Angeles, New York,
                  Miami Beach
                </p>
              </div>
            </Card>

            {/* Agent Status Card */}
            <Card className="p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
              <div className="grid grid-cols-3 text-center">
                <div>
                  <h4 className="text-2xl font-bold text-blue-600">1050</h4>
                  <p className="text-gray-500 text-sm">Total Listings</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-green-600">650</h4>
                  <p className="text-gray-500 text-sm">Properties Sold</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-indigo-600">400</h4>
                  <p className="text-gray-500 text-sm">Properties Rent</p>
                </div>
              </div>
            </Card>

            {/* Active Listings */}
            <Card className="p-6 shadow-md">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold">Active Listing</h3>
                <button className="text-blue-600 hover:underline text-sm">
                  View All
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {agent.listings?.map((listing, idx) => (
                  <Card key={idx} className="overflow-hidden shadow-sm">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="h-40 w-full object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-600 font-semibold">
                          ${listing.price}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <MapPin size={14} /> {listing.location}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800">
                        {listing.title}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Home size={14} /> {listing.beds} Beds • {listing.area}M
                      </p>
                    </CardContent>
                  </Card>
                )) || (
                  <p className="text-gray-500 text-sm">
                    No active listings available.
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
