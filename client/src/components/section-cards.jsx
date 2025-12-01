import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function SectionCards() {
  const [properties, setProperties] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/properties");
        if (
          res.data?.data?.properties &&
          Array.isArray(res.data.data.properties)
        ) {
          setProperties(res.data.data.properties.slice(0, 3));
        } else {
          console.error("Failed to fetch properties", res.data);
        }
      } catch (err) {
        console.error(
          "Error fetching properties:",
          err.response?.data || err.message
        );
      }
    };
    fetchProperties();
  }, []);

   const handleCardClick = (property) => {
    const id = property._id || property.id;
    navigate(`/properties/${id}`);
  };

  return (
    <div className="px-4 lg:px-0">
      <Card className="shadow-sm mt-8 border rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h3 className="md:text-2xl text-[18px] font-semibold text-gray-800">
              Property List
            </h3>
            {/* Replace tabs with single button */}
            <div className="flex justify-end">
              <a
                href="/properties"
                className=" border border-gray-300 bg-gray-100 hover:bg-gray-200 text-black px-3 py-1 rounded-sm transition"
              >
                View All
              </a>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-0">
            {properties.map((property, index) => {
              const id = property._id || property.id;
              const img =
                property.mainImage ||
                property.image ||
                (property.galleryImages && property.galleryImages[0]) ||
                "";

              const imageUrl =
                img && img.startsWith("http")
                  ? img
                  : img
                  ? `http://localhost:5000/${img.replace(/\\/g, "/")}`
                  : "/placeholder.png";

              return (
                <Card
                  key={id || index}
                  className="rounded-xl cursor-pointer py-0 shadow-sm hover:shadow-md transition"
                  onClick={()=> handleCardClick(property)}
                >
                  <CardContent className="p-4">
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <h4 className="mt-3 font-semibold">{property.title}</h4>
                    <div className="flex items-center justify-between">
                      {" "}
                      <p className="text-sm text-gray-500">
                        {property.location?.city && property.location?.country
                          ? `${property.location.city}, ${property.location.country}`
                          : "Unknown Location"}
                      </p>
                      <span className="text-blue-600 bg-[#DADEFA] p-2 rounded-sm text-sm font-bold">
                        {property.price?.currency || "$"}
                        {property.price?.amount}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {properties.length === 0 && (
              <p className="text-gray-500 text-center col-span-3">
                No properties available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
