import React from "react";
import { MapPin, BedDouble, Bath, MoveDiagonal } from "lucide-react";
import axios from "@/utils/axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function PropertyCards({ property }) {
  const navigate = useNavigate();
  if (!property) return null;

  // Handle Image URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    if (typeof imgPath !== "string") return "/placeholder.png";

    const baseHost = axios.defaults.baseURL.replace("/api", "");
    return imgPath.startsWith("http")
      ? imgPath
      : `${baseHost}/${imgPath.replace(/\\/g, "/")}`;
  };

  const p = property;

  return (
    <Card
      onClick={() => navigate(`/property/${p.slug}`)}
    className="gap-0 overflow-hidden py-0 rounded-xl shadow-sm hover:shadow-lg transition border bg-white cursor-pointer">
      <img
        src={getImageUrl(p.mainImage)}
        alt={p.title}
        className="w-full h-40 object-cover"
      />

      <CardHeader className="md:p-3 p-2">
        <CardTitle className="text-lg mt-0 py-0 font-semibold text-gray-800 truncate">
          {p.title}
        </CardTitle>

        <p className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin size={16} />
          {p?.location?.city}, {p?.location?.country}
        </p>

        <p className="text-lg font-semibold mt-0">
          ${p?.price?.amount}{" "}
          {p?.availabilityType === "for_rent" && (
            <span className="text-sm text-gray-500">
              / {p?.price?.duration}
            </span>
          )}
        </p>
      </CardHeader>

      <CardContent className="px-3 pb-4">
        <div className="flex items-center text-gray-600 text-[12px] gap-3">
          {/* Beds */}
          <div className="flex items-center gap-1">
            <BedDouble size={13} />
            <span>
              {p?.facilities?.beds ?? 0}{" "}
              {(p?.facilities?.beds ?? 0) <= 1 ? "Bed" : "Beds"}
            </span>
          </div>

          {/* Baths */}
          <div className="flex items-center gap-1">
            <Bath size={13} />
            <span>
              {p?.facilities?.baths ?? 0}{" "}
              {(p?.facilities?.baths ?? 0) <= 1 ? "Bath" : "Baths"}
            </span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1">
            <MoveDiagonal size={13} />
            <span>{p?.facilities?.area ?? 0} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
