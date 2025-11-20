import React from "react";
import axios from "@/utils/axios";

export default function CityCard({ city, count, image }) {
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    const baseHost = axios.defaults.baseURL.replace("/api", "");
    return imgPath.startsWith("http")
      ? imgPath
      : `${baseHost}/${imgPath.replace(/\\/g, "/")}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 cursor-pointer flex items-center gap-4">
      {/* City Image */}
      <img
        src={getImageUrl(image)}
        alt={city}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
      />

      {/* City Name + Property Count */}
      <div>
        <h3 className="font-semibold text-lg">{city}</h3>
        <p className="text-gray-500 text-sm">
          {count} {count === 1 ? "Property" : "Properties"}
        </p>
      </div>
    </div>
  );
}
