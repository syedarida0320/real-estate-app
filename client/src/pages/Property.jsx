// src/pages/Property.jsx (updated)
import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import {
  MapPin,
  BedDouble,
  MoveDiagonal,
  Plus,
  Edit,
} from "lucide-react";
import PropertyFilters from "@/components/PropertyFilters";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    status: "any",
    type: "any",
    country: "all",
    state: "all",
    search: "",
  });

  const user = useAuth();
  const navigate = useNavigate();

  // 🏘️ Fetch all properties
  const fetchProperties = async () => {
    try {
      const res = await axios.get("/properties");
      const data = res?.data?.data || res?.data || [];
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Navigate to add property page
  const handleAddProperty = () => {
    navigate("/properties/add");
  };

  // Navigate to edit property page
  const handleEditProperty = (property) => {
    const id = property._id || property.id;
    navigate(`/properties/edit/${id}`);
  };

  // check if current user is owner/creator of the property
  const isOwnerOfProperty = (property) => {
    if (!user?.user) return false;
    const uid = user.user._id || user.user.id || user.user._id?.toString();
    const propUserId = property.userId?._id || property.userId || property.userId?.toString();
    return uid && propUserId && uid.toString() === propUserId.toString();
  };

  // formatting for card images (kept same as original)
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    if (typeof img !== "string") return "/placeholder.png";
    if (img.startsWith("http")) return img;
    return img ? `http://localhost:5000${img}` : "/placeholder.png";
  };

  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Property Listings
          </h2>

          {(user?.user?.role === "Admin" || user?.user?.role === "Agent") && (
            <Button
              onClick={handleAddProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow inline-flex items-center"
            >
              <Plus className="w-4 h-4 text-white mr-2" />
              Add Property
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Property Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {properties.map((property) => {
            const id = property._id || property.id;
            const img =
              property.mainImage ||
              property.image ||
              (property.galleryImages && property.galleryImages[0]) ||
              "";
            const imageUrl = getImageUrl(img);

            return (
              <div key={id} className="group relative">
                <Link to={`/properties/${id}`} className="group">
                  <Card className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col md:flex-row bg-white p-0">
                    <div className="w-full md:w-1/2 h-56 md:h-40 flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <CardContent className="w-full md:w-1/2 py-4 px-1 relative flex flex-col justify-between">
                      <Badge className="absolute top-1 bg-[#DADEFA] text-blue-600 font-semibold text-[12px] rounded px-3 py-1 shadow">
                        {property.price?.currency || "USD"}
                        {property.price?.amount ?? ""}
                      </Badge>

                      <div className="pl-0">
                        <h3 className="mt-6 md:mt-5 text-[15px] leading-6 font-semibold text-gray-800 mb-0.5">
                          {property.title}
                        </h3>

                        <div className="flex items-center text-sm text-gray-500 mb-1.5">
                          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                          <span>
                            {property.location?.city
                              ? `${property.location.city}, ${
                                  property.location?.country || ""
                                }`
                              : "Unknown location"}
                          </span>
                        </div>

                        <div className="flex space-x-4 text-sm text-gray-600">
                          <div className="flex items-center text-[12px] gap-2">
                            <BedDouble className="w-4 h-4" />
                            {property.facilities?.beds ?? 0} Beds
                          </div>
                          <div className="flex items-center text-[12px] gap-1">
                            <MoveDiagonal className="w-4 h-4" />
                            {property.facilities?.area ?? "-"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        Click to view details
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Edit button only visible to owner/creator or Admin */}
                {((user?.user?.role === "Admin") || isOwnerOfProperty(property)) && (
                  <div className="absolute top-2 right-3">
                    <Button
                      size="sm"
                      className=" text-black bg-white  border shadow-sm text-sm hover:bg-gray-300"
                      onClick={() => handleEditProperty(property)}
                    >
                    <Edit className=" w-3 h-3"/>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Property;
