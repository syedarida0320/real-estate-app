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
    <Card className="bg-white  shadow-sm hover:shadow-md transition-all md:p-4 p-3 cursor-pointer flex flex-row items-center gap-0">
      {/* City Image */}
      <img
        src={getImageUrl(image)}
        alt={city}
        className="md:w-20 md:h-20 w-15 h-15 rounded-xl object-cover flex-shrink-0"
      />

      {/* City Name + Property Count */}
      <CardContent className="px-2">
        <CardTitle className="font-semibold md:text-lg text-sm">{city}</CardTitle>
        <CardDescription className="text-gray-500 text-[12px]">
          {count} {count === 1 ? "Property" : "Properties"}
        </CardDescription>
      </CardContent>
    </Card>
    </div>
  );
}
