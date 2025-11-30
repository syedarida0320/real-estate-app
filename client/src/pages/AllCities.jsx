import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CityCard from "@/components/CityCard";

export default function AllCities() {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    const baseHost = axios.defaults.baseURL.replace("/api", "");
    return imgPath.startsWith("http")
      ? imgPath
      : `${baseHost}/${imgPath.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const { data } = await axios.get("/properties/cities/list");
      setCities(data.cities);
    } catch (err) {
      console.log("Error loading cities");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex space-x-5 items-center mb-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-black flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-4" />
          <h2 className="text-3xl font-bold">All Cities</h2>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cities.map((c, i) => (
          <CityCard
            key={i}
            city={c.city}
            count={c.count}
            image={c.image}
            onClick={() => navigate(`/properties/search?search=${c.city}`)}
            className="cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
