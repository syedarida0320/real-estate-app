// src/components/PropertyCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, MoveDiagonal, Edit } from "lucide-react";
import axios from "@/utils/axios";

const getImageUrl = (imgPath) => {
  if (!imgPath) return "/placeholder.png";
  if (typeof imgPath !== "string") return "/placeholder.png";
  const baseHost = axios.defaults.baseURL.replace("/api", "");
  return imgPath.startsWith("http")
    ? imgPath
    : `${baseHost}/${imgPath.replace(/\\/g, "/")}`;
};

const PropertyCard = ({
  property,
  user,
  onEdit,
  showEdit = false, // optional
}) => {
  const id = property._id || property.id;
  const mainImg =
    property.mainImage ||
    (Array.isArray(property.galleryImages) && property.galleryImages[0]) ||
    null;
  const imageUrl = getImageUrl(mainImg);

  // helper for owner check (used in Property.jsx)
  const isOwner =
    user?.user &&
    (user.user._id === property.userId?._id ||
      user.user._id === property.userId);

  return (
    <div key={id} className="group relative">
      <Link to={`/properties/${id}`} className="group">
        <Card className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col md:flex-row bg-white p-0">
          {/* Image */}
          <div className="w-full md:w-1/2 h-56 md:h-40 flex-shrink-0">
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
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
                    ? `${property.location.city}, ${property.location?.country || ""}`
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
                  {property.facilities?.area ?? "-"}M
                </div>
              </div>
            </div>

            <div className="mt-1 text-xs text-gray-400">
              Click to view details
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Edit Button */}
      {showEdit && (user?.user?.role === "Admin" || isOwner) && (
        <div className="absolute top-2 right-3">
          <Button
            size="sm"
            className=" text-black bg-white  border shadow-sm text-sm hover:bg-gray-300"
            onClick={() => onEdit(property)}
          >
            <Edit className=" w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
