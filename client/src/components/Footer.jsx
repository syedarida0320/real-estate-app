import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/utils/axios";
import { Link } from "react-router-dom";

export default function Footer() {
  const [popularSearches, setPopularSearches] = useState([]);

  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const res = await axios.get("/properties/all"); // Fetch all properties
        const properties = res?.data?.data?.properties || [];

        // Generate unique popular searches based on type + availabilityType
        const searchesMap = {};
        properties.forEach((p) => {
          if (p.type && p.availabilityType) {
            const key = `${p.type}-${p.availabilityType}`;
            if (!searchesMap[key]) {
              searchesMap[key] = {
                type: p.type,
                availabilityType: p.availabilityType,
              };
            }
          }
        });

        setPopularSearches(Object.values(searchesMap));
      } catch (error) {
        console.error("Error fetching popular searches:", error);
      }
    };

    fetchPopularSearches();
  }, []);

  return (
    <footer className="bg-[#111] text-white py-10">
      <div className="max-w-6xl px-10 mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Popular Search */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Popular Search</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {popularSearches.length > 0 ? (
              popularSearches.map((item, idx) => (
                <li key={idx}>
                   <Link
                   to={`/properties/search?type=${item.type}&availabilityType=${item.availabilityType}`}

                    className="hover:underline"
                  >
                    {`${item.type} ${item.availabilityType === "for_sale" ? "for Sale" : "for Rent"}`}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500"></li>
            )}
          </ul>
        </div>

        {/* Customer Care & Live Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Total Free Customer Care</h3>
          <p className="text-gray-300 text-sm mb-6">+(088) 123 456 789</p>

          <h3 className="text-lg font-semibold mb-2">Live Support</h3>
          <p className="text-gray-300 text-sm">realestate@gmail.com</p>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Keep Yourself Up to Date</h3>
          <div className="flex items-center gap-3">
            <Input
              type="email"
              placeholder="Your email"
              className="bg-white text-black"
            />
            <Button className="bg-white text-black hover:bg-gray-300">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-xs text-gray-400">
        © Real Estate App — All rights reserved
      </div>
    </footer>
  );
}
