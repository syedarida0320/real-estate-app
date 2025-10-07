import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SectionCards() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/properties");
        if (res.data?.success) {
          setProperties(res.data.data.slice(0, 3)); // only take 3
        } else {
          console.error("Failed to fetch properties");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="px-4 lg:px-0">
      {/* Property List with Tabs */}
      <Card className="shadow-sm mt-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h3 className="md:text-lg text-[18px] font-semibold">
              Property List
            </h3>

            {/* Tabs Section */}
            <Tabs defaultValue="popular" className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:flex md:space-x-2">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="recent">Most Recent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-0">
            {properties.map((property, index) => (
              <Card
                key={property._id || index}
                className="rounded-xl py-0 shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-2 ">
                  <img
                    src={`http://localhost:5000${property.image}`}
                    alt={property.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <h4 className="mt-3 font-semibold">{property.title}</h4>
                  <p className="text-sm text-gray-500">{property.location}</p>
                  <span className="text-blue-600 font-bold">
                    ${property.price}
                  </span>
                </CardContent>
              </Card>
            ))}

            {properties.length === 0 && (
              <p className="text-gray-500 text-center col-span-3">
                No properties available.
              </p>
            )}
          </div>
        </CardContent>{" "}
      </Card>
    </div>
  );
}
