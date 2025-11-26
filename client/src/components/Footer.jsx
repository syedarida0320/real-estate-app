import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/utils/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { cacheFetchStorage } from "@/utils/cacheStorage";

export default function Footer() {
  const [popularSearches, setPopularSearches] = useState([]);
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
     toast.error("Please enter an email");
      return;
    }

  // Optional: basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      const res = await axios.post("/subscribe", { email });

     if (res.data.success) {
        toast.success(res.data.message || "Subscribed successfully!");
        setEmail(""); // clear input
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("You are already subscribed");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
         const properties = await cacheFetchStorage("footerPopularSearches", async () => {
          const res = await axios.get("/properties");
          return res?.data?.data?.properties || [];
        });

        const ORDERED_TYPES = [
          "Apartment",
          "Hotel",
          "House",
          "Commercial",
          "Garages",
          "Lots",
        ];

        const PRIORITY_ORDER = ["for_sale", "for_rent"]; // sold excluded from footer

        // Map to store unique searches
        const searchesMap = {};

        properties.forEach((p) => {
          if (!p.type || !p.availabilityType) return;

          if (p.availabilityType === "sold") return; // Skip sold from Popular Search

          const key = `${p.type}-${p.availabilityType}`;
          if (!searchesMap[key]) {
            searchesMap[key] = {
              type: p.type,
              availabilityType: p.availabilityType,
            };
          }
        });

        let sortedList = Object.values(searchesMap);

        // Sort by type order AND availability order
        sortedList.sort((a, b) => {
          const typeA = ORDERED_TYPES.indexOf(a.type);
          const typeB = ORDERED_TYPES.indexOf(b.type);

          if (typeA !== typeB) return typeA - typeB;

          // If same type → sort by availability (sale first, rent second)
          const availA = PRIORITY_ORDER.indexOf(a.availabilityType);
          const availB = PRIORITY_ORDER.indexOf(b.availabilityType);

          return availA - availB;
        });

        setPopularSearches(sortedList);
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
                    {`${item.type} ${
                      item.availabilityType === "for_sale"
                        ? "for Sale"
                        : "for Rent"
                    }`}
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
          <h3 className="text-lg font-semibold mb-4">
            Total Free Customer Care
          </h3>
          <p className="text-gray-300 text-sm mb-6">+(088) 123 456 789</p>

          <h3 className="text-lg font-semibold mb-2">Live Support</h3>
          <p className="text-gray-300 text-sm">realestate@gmail.com</p>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Keep Yourself Up to Date
          </h3>
          <div className="flex items-center gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="bg-white text-black"
            />
            <Button
              onClick={handleSubscribe}
              className="bg-white text-black hover:bg-gray-300"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-xs text-gray-400">
        <span>&copy; {new Date().getFullYear()} Real Estate App</span> . All
        rights reserved
      </div>
    </footer>
  );
}
