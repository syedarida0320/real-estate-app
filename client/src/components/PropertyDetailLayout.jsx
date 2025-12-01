import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  BedDouble,
  Bath,
  MoveDiagonal,
  Wifi,
  Cigarette,
  Utensils,
  Home,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Facility = ({ children }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    {children}
  </div>
);

export default function PropertyDetailLayout({
  property,
  agent,
  agentProfileImage,
  agentPropertiesCount,
  lat,
  lng,
  children, // <-- If you want to pass extra sections
}) {

const baseURL = import.meta.env.VITE_API || "http://localhost:5000";
  const mainImageUrl = property.mainImage
    ? `${baseURL}/${property.mainImage.replace(/\\/g, "/")}`
    : "/placeholder.jpg";

  const galleryUrls = Array.isArray(property.galleryImages)
    ? property.galleryImages.map(
        (img) => `${baseURL}/${img.replace(/\\/g, "/")}`
      )
    : [];

  return (
    <div className="p-4 md:-ml-[25px] bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Back Button */}
        <Link
          to="/properties"
          className="text-2xl inline-flex space-x-3 text-black font-medium p-4"
        >
          <ChevronLeft className="w-7 h-7" />
          <h1>Details</h1>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="w-full rounded-lg overflow-hidden h-64 md:h-96">
              <img src={mainImageUrl} className="w-full h-full object-cover" />
            </div>

            {/* Gallery */}
            {galleryUrls?.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {galleryUrls.slice(0, 8).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ))}
                {galleryUrls.length > 8 && (
                  <div className="col-span-1 flex items-center justify-center text-xs text-gray-500 border rounded-md">
                    +{galleryUrls.length - 8}
                  </div>
                )}
              </div>
            )}

            {/* Title + Location */}
            <div className="mt-6 flex flex-col md:flex-row justify-between">
              <div>
                <span className="text-[18px] font-bold text-gray-600">
                  {property?.type}
                </span>

                <h1 className="text-2xl font-bold text-gray-800">
                  {property?.title}
                </h1>

                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  <span>
                    {property.location?.city || "Unknown City"},{" "}
                    {property.location?.country || "Unknown Country"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-semibold text-blue-600">
                  {property?.price?.currency} {property?.price?.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {property?.price?.duration}
                </p>
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <Facility>
                <BedDouble className="w-5 h-5" /> {property?.facilities?.beds}{" "}
                Beds
              </Facility>

              <Facility>
                <Bath className="w-5 h-5" /> {property?.facilities?.baths} Baths
              </Facility>

              <Facility>
                <MoveDiagonal className="w-5 h-5" />{" "}
                {property?.facilities?.area}
              </Facility>

              <Facility>
                <Wifi className="w-5 h-5" />
                {property?.facilities?.wifi ? "Available" : "No"}
              </Facility>

              <Facility>
                <Cigarette className="w-5 h-5" />
                {property?.facilities?.smokingArea
                  ? "Smoking Area"
                  : "No Smoking Area"}
              </Facility>

              <Facility>
                <Utensils className="w-5 h-5" />
                {property?.facilities?.kitchen ? "Kitchen" : "No Kitchen"}
              </Facility>

              <Facility>
                <Home className="w-5 h-5" />
                {property?.facilities?.balcony ? "Balcony" : "No Balcony"}
              </Facility>

              <Facility>
                <Car className="w-5 h-5" />
                {property?.facilities?.parkingArea ? "Parking" : "No Parking"}
              </Facility>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Description
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {property?.description || "No description available."}
              </p>
            </div>

            {children}
          </div>

          {/* RIGHT SIDE */}
          <aside className="space-y-6 pb-6">
            {/* Agent Box */}
            <div className="bg-white rounded-2xl border shadow-md overflow-hidden">
              <div className="flex items-center justify-center mt-4">
                {agentProfileImage}
              </div>

              <div className="pt-5 pb-4 text-center px-3">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {agent?.firstName} {agent?.lastName}
                </h2>

                <p className="text-gray-500 text-[14px]">{agent?.role}</p>
                <p className="text-gray-500 text-[14px]">
                  {agent.address
                    ? Object.values(agent.address).filter(Boolean)
                    : "No location"}
                </p>
                <p className="text-black text-[14px]">
                  {agentPropertiesCount}{" "}
                  {agentPropertiesCount <= 1 ? "Property" : "Properties"}
                </p>

                {/* Contact */}
                <div className="flex justify-center gap-4 mt-6">
                  {agent?.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Email
                    </a>
                  )}
                  {agent?.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
              <p className="text-sm text-gray-500 mb-4">Location Map</p>

              {lat && lng ? (
                <iframe
                  title="map"
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                  className="w-full h-60 rounded-md"
                ></iframe>
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Map
                </div>
              )}

              <Button className="w-full mt-4 cursor-pointer">Book Now</Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
