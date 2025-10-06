import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { MapPin, BedDouble, MoveDiagonal, Plus } from "lucide-react";
import PropertyFilters from "@/components/PropertyFilters";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    status: "any",
    type: "any",
    country: "all",
    state: "all",
    search: "",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/properties");
        setProperties(res.data.data);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Property Listings
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow">
            <Plus className="w-4 h-4 text-white" />
            Add Property
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Property Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="rounded-2xl shadow hover:shadow-lg transition flex-row py-0 overflow-hidden flex bg-white"
            >
              {/* Left side - Image */}
              <div className="w-1/2 h-40">
                <img
                  src={`http://localhost:5000${property.image}`}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right side - Details */}
              <CardContent className="w-1/2 px-0 py-4 relative flex flex-col justify-between">
                <Badge className="absolute top-2 left-0 bg-[#DADEFA] text-blue-600 font-semibold text-[12px] rounded px-3 py-1 shadow hover:bg-[#DADEFA]">
                  ${property.price}
                </Badge>

                <div>
                  <h3 className="mt-7 text-[16px] leading-6 font-semibold text-gray-800 mb-1">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    {property.location}
                  </div>

                  <div className="flex space-x-4 text-sm text-gray-600">
                    <div className="flex items-center text-[12px] gap-1">
                      <BedDouble className="w-4 h-4" />
                      {property.beds} Beds
                    </div>
                    <div className="flex items-center text-[12px] gap-1">
                      <MoveDiagonal className="w-4 h-4" />
                      {property.size}
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

export default Property;
