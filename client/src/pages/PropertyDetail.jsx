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
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dummyAvatar from "@/assets/dummy-avatar.png";


const AgentProfileImage = ({ agentId }) => {
  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    if (!agentId) return;
    
    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(`/users/${agentId}/profile-image`, {
          responseType: "blob",
        });
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
      } catch (err) {
        console.error("Error loading agent profile image:", err);
        setImageUrl(dummyAvatar);
      }
    };
    
    fetchProfileImage();
  }, [agentId]);

  return (
    <img
    src={imageUrl || dummyAvatar}
    alt="Agent"
    className="w-20 h-20 rounded-full object-cover border border-gray-300"
    />
  );
};

  const Facility = ({ children }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
    {children}
  </div>
);

const formatImageUrl = (img) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  return `http://localhost:5000${img}`;
};
const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentPropertiesCount, setAgentPropertiesCount]=useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/properties/${id}`);
        const data = res?.data?.data || res?.data;
        setProperty(data);

         if (data?.userId?._id) {
          const countRes = await axios.get(
            `/properties?userId=${data.userId._id}`
          );
          const allProperties = countRes?.data?.data || countRes?.data || [];
          setAgentPropertiesCount(allProperties.length || 0);
        }
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
        <div className="p-6 text-center">Loading...</div>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Property not found</div>
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
                  <div className="flex items-center font-bold gap-2 mb-0.5">
                    <span className="text-[18px] text-gray-600">
                      {property.type || "Property"}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    <span>
                      {/* {property.location?.address
                        ? `${property.location.address}, `
                        : ""} */}
                      {property.location?.city || "Unknown City"},{" "}
                      {property.location?.country || "Unknown Country"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-lg font-semibold text-blue-600">
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
                  {property.facilities?.area || "N/A"}M
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
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {property.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Right Side */}
            <aside className="space-y-6 pb-6">
              <div className="bg-white rounded-2xl border shadow-md overflow-hidden">
       <div className="flex items-center justify-center gap-1 mt-4">
                 <AgentProfileImage agentId={agent._id}/>

</div>
             
                <div className="pt-5 pb-4 text-center px-3">
                  <h2 className="font-semibold text-gray-800 text-lg">
                    {agentFullName}
                  </h2>
                  <p className="text-gray-500 text-[14px] m-2">
                    {agent.role || "Agent"}
                  </p>
                  <p className="text-gray-500 text-[14px]">
                    {agent.address || "No location"}
                  </p>
                   <p className="text-black text-[14px]">
                    {agentPropertiesCount}{" "}
                    {agentPropertiesCount === 1 ? "Property" : "Properties"}
                  </p>


                  {/* Contact Buttons */}
                  <div className="flex justify-center gap-4 mt-6">
                    {agent.email && (
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-[8px] text-sm font-medium shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
                      >
                        <Mail size={15} className="text-white" />
                        Message
                      </a>
                    )}
                     {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-500 text-white px-5 py-2.5 rounded-[8px] text-sm font-medium shadow-md hover:from-green-600 hover:to-green-500 transition-all duration-200"
                      >
                        <Phone size={15} className="text-white" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
               <p className="text-sm text-gray-500 mb-4 font-medium">
                  Location Map
                </p>
                {lat && lng ? (
                  <iframe
                    title="property-map"
                    src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                    className="w-full h-70 rounded-md border-1 mb-6"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400 mb-6">
                    Map not available
                  </div>
                )}
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
