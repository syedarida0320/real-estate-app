// src/pages/PropertyDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import {
  BedDouble,
  Bath,
  MapPin,
  Wifi,
  MoveDiagonal,
  ChevronLeft,
  Home,
  Car,
  Cigarette,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formatImageUrl = (img) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `http://localhost:5000${img}`;
};

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1 border-b last:border-b-0">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-700">{value ?? "N/A"}</span>
  </div>
);

const Facility = ({ children }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    {children}
  </div>
);

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/properties/${id}`);
        const data = res?.data?.data || res?.data;
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">Loading...</div>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="p-6">Property not found</div>
      </MainLayout>
    );
  }

  const hero =
    property.mainImage || property.galleryImages?.[0] || property.image;
  const gallery =
    property.galleryImages || (property.image ? [property.image] : []);

  const agent = property.userId || {};
  const agentFullName = agent.firstName
    ? `${agent.firstName} ${agent.lastName}`
    : "Unknown Agent";

  const lat = property?.location?.mapLocation?.lat;
  const lng = property?.location?.mapLocation?.lng;

  return (
    <MainLayout>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
          <Link
            to="/properties"
            className="text-2xl flex space-x-3 text-black font-medium p-4"
          >
            <ChevronLeft className="w-7 h-7" />
            <h1>Details</h1>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
            {/* Left Side */}
            <div className="lg:col-span-2">
              {/* Hero Image */}
              <div className="w-full rounded-lg overflow-hidden h-64 md:h-96">
                <img
                  src={formatImageUrl(hero)}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {gallery.slice(0, 8).map((g, idx) => (
                    <img
                      key={idx}
                      src={formatImageUrl(g)}
                      alt={`${property.title}-${idx}`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                  ))}
                  {gallery.length > 8 && (
                    <div className="col-span-1 flex items-center justify-center text-xs text-gray-500 border rounded-md">
                      +{gallery.length - 8}
                    </div>
                  )}
                </div>
              )}

              {/* Title + Location */}
              <div className="mt-6 flex flex-col md:flex-row justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    <span>
                      {property.location?.city || "Unknown city"},{" "}
                      {property.location?.country || "Unknown country"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {property.price?.currency || "$"}{" "}
                    {property.price?.amount ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.price?.duration || "Per Day"}
                  </p>
                </div>
              </div>

              {/* Facilities */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <Facility>
                  <BedDouble className="w-5 h-5" />
                  {property.facilities?.beds ?? 0} Beds
                </Facility>
                <Facility>
                  <Bath className="w-5 h-5" />
                  {property.facilities?.baths ?? 0} Baths
                </Facility>
                <Facility>
                  <MoveDiagonal className="w-5 h-5" />
                  {property.facilities?.area || "N/A"}
                </Facility>
                <Facility>
                  <Wifi className="w-5 h-5" />
                  {property.facilities?.wifi ? "Available" : "No"}
                </Facility>
                <Facility>
                  <Cigarette className="w-5 h-5" />
                  {property.facilities?.smokingArea
                    ? "Smoking Area"
                    : "No Smoking Area"}
                </Facility>
                <Facility>
                  <Utensils className="w-5 h-5" />
                  {property.facilities?.kitchen ? "Kitchen" : "No Kitchen"}
                </Facility>
                <Facility>
                  <Home className="w-5 h-5" />
                  {property.facilities?.balcony ? "Balcony" : "No Balcony"}
                </Facility>
                <Facility>
                  <Car className="w-5 h-5" />
                  {property.facilities?.parkingArea ? "Parking" : "No Parking"}
                </Facility>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Description
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {property.description || "No description available."}
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Additional Details
                </h3>
                <div className="border rounded-lg p-4 space-y-1">
                  <InfoItem
                    label="Property Type"
                    value={property.type || "N/A"}
                  />
                  <InfoItem
                    label="Rating"
                    value={property.rating || "No rating"}
                  />
                  <InfoItem
                    label="Created At"
                    value={new Date(property.createdAt).toLocaleDateString()}
                  />
                  <InfoItem
                    label="Updated At"
                    value={new Date(property.updatedAt).toLocaleDateString()}
                  />
                </div>
              </div>
            </div>

            {/* Right Side */}
            <aside className="space-y-4 pb-6">
              {/* Agent Info */}

              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={agent?.profileImage || "/avatar-placeholder.png"}
                    alt="Agent"
                    className="w-14 h-14 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold">{agentFullName}</p>
                    <p className="text-xs text-gray-400">
                      {agent.role || "Agent"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {agent.address?.city || "No location"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="w-full">
                      <Button className="w-full">Call</Button>
                    </a>
                  )}
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Message
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-sm text-gray-500 mb-2">Location Map</p>
                {lat && lng ? (
                  <iframe
                    title="property-map"
                    src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                    className="w-full h-40 rounded-md border-0"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400">
                    Map not available
                  </div>
                )}
              </div>

              {/* Booking */}
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Book</div>
                <p className="text-lg font-semibold">
                  {property.price?.currency || "$"}{" "}
                  {property.price?.amount ?? "N/A"}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  {property.price?.duration || "Per Day"}
                </p>
                <Button className="w-full">Book Now</Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetail;
