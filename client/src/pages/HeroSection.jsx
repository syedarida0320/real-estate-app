import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import backgroundImg from "../assets/background.jpg";
import { Menu, MoveUpRight } from "lucide-react";

export default function HeroSection() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [heroContent, setHeroContent] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    if (typeof imgPath !== "string") return "/placeholder.png";

    const baseHost = axios.defaults.baseURL.replace("/api", "");
    return imgPath.startsWith("http")
      ? imgPath
      : `${baseHost}/${imgPath.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    loadPropertyTypes();
    loadCountries();
    loadCities();
  }, []);

  // 👉 Fetch unique property types from backend DB
  const loadPropertyTypes = async () => {
    try {
      const { data } = await axios.get("/properties/all?limit=200");
      const types = [...new Set(data.data.properties.map((p) => p.type))];
      setPropertyTypes(types);
    } catch (err) {
      console.log("Error loading types");
    }
  };

  // 👉 Fetch unique countries
  const loadCountries = async () => {
    try {
      const { data } = await axios.get("/properties/countriesProperty");
      setCountries(data.data);
    } catch (err) {
      console.log("Error loading countries");
    }
  };

  // 👉 Fetch cities with property count
  const loadCities = async () => {
    try {
      const { data } = await axios.get("/properties/cities/list");
      setCities(data.cities);
    } catch (err) {
      console.log("Error loading cities");
    }
  };

  return (
    <div>
      <div
        className="md:px-30 md:w-full h-screen md:bg-cover bg-center flex flex-col"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* Navbar */}
        <nav className="mx-auto w-full flex items-center md:justify-between px-10 py-6 text-white relative">
          {/* Mobile Menu Button */}
          <button className="md:hidden mr-6 text-white text-3xl">
            <Menu />
          </button>

          <h1 className="text-2xl font-bold tracking-wide">RealEstate</h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 text-lg">
            <li className="hover:text-gray-300 cursor-pointer">Home</li>

            {/* Properties Dropdown */}
            <li
              className="relative cursor-pointer hover:text-gray-300"
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
            >
              Properties
              {openDropdown && (
                <ul className="absolute left-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40 py-2">
                  {propertyTypes.map((type, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="hover:text-gray-300 cursor-pointer">Agents</li>
            <li className="hover:text-gray-300 cursor-pointer">About</li>
            <li className="hover:text-gray-300 cursor-pointer">Contact</li>
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <a
              href="/login"
              className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              Sign In
            </a>

            <a
              href="/register"
              className="bg-transparent border border-white px-5 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition"
            >
              Register
            </a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find The Perfect Place to Live With your Family
            </h1>

            <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-xl">
              <div className="flex gap-4 border-b pb-2 mb-4">
                <button className="font-semibold text-black border-b-2 border-black">
                  All
                </button>
                <button className="text-gray-600 hover:text-black">
                  For Sale
                </button>
                <button className="text-gray-600 hover:text-black">
                  For Rent
                </button>
              </div>

              <div className="flex text-gray-600 flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter Keyword"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none text-gray-600"
                />

                {/* Dynamic Types */}
                <select className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none">
                  <option>Type</option>
                  {propertyTypes.map((type, i) => (
                    <option key={i}>{type}</option>
                  ))}
                </select>

                <button className="px-5 py-2 bg-[#26415E] text-white rounded-lg hover:bg-gray-800">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTIES BY CITIES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Properties By Cities</h2>

          <a href="/all-cities" className="text-sm flex font-semibold hover:underline">
            See All Cities
            <MoveUpRight className="text-gray-500 ml-2 w-5 h-5" />
          </a>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.slice(0,8).map((c, i) => {
            const cityImg = c.image;
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer"
              >
                <img
                  src={getImageUrl(cityImg)}
                  className="rounded-lg w-full h-40 object-cover"
                />

                <h3 className="font-semibold mt-3">{c.city}</h3>
                <p className="text-gray-500 text-sm">{c.count} Properties</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
