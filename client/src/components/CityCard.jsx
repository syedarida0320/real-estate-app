import React from "react";
import axios from "@/utils/axios";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CityCard({ city, count, image, onClick, className }) {
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    const baseHost = axios.defaults.baseURL.replace("/api", "");
    return imgPath.startsWith("http")
      ? imgPath
      : `${baseHost}/${imgPath.replace(/\\/g, "/")}`;
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
    >
    <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 cursor-pointer flex flex-row items-center gap-0">
      {/* City Image */}
      <img
        src={getImageUrl(image)}
        alt={city}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
      />

      {/* City Name + Property Count */}
      <CardContent>
        <CardTitle className="font-semibold text-lg">{city}</CardTitle>
        <CardDescription className="text-gray-500 text-sm">
          {count} {count === 1 ? "Property" : "Properties"}
        </CardDescription>
      </CardContent>
    </Card>
    </div>
  );
}
