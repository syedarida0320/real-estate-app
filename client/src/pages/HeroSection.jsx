import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import backgroundImg from "../assets/background.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, MoveUpRight } from "lucide-react";
import CityCard from "@/components/CityCard";
import PropertyCards from "@/components/PropertyCards";
import ApartmentTypes from "@/components/ApartmentTypes";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("any");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPropertyTypes();
    loadCountries();
    loadCities();
    loadLatestProperties();
  }, []);

  // 👉 Fetch Latest 8 Properties
  const loadLatestProperties = async () => {
    try {
      const { data } = await axios.get("/properties/all?limit=8");
      setLatestProperties(data.data.properties);
    } catch (error) {
      console.log("Error loading latest properties:", error);
    }
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

          <h1 className="text-2xl font-bold tracking-wide">Real Estate App</h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 text-lg">
            <li className="hover:text-gray-300 cursor-pointer">Home</li>

            {/* Properties Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none cursor-pointer">
                Properties
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white text-black w-40 rounded-lg shadow-lg">
                {propertyTypes.map((type, i) => (
                  <DropdownMenuItem
                    key={i}
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/properties/search?type=${type}`);
                    }}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <li className="hover:text-gray-300 cursor-pointer">About</li>
            <li className="hover:text-gray-300 cursor-pointer">Contact</li>
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <a href="/login">
              <Button className="cursor-pointer bg-white text-black hover:bg-gray-200">
                Sign In
              </Button>
            </a>

            <a href="/register">
              <Button className="cursor-pointer bg-white text-black hover:bg-gray-200">
                Register
              </Button>
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
                <Button
                  onClick={() => setSelectedStatus("any")}
                  variant="ghost"
                  className={`font-semibold border-b-2 text-black rounded-none ${
                    selectedStatus === "any"
                      ? "border-white"
                      : "border-transparent"
                  }`}
                >
                  All
                </Button>

                <Button
                  onClick={() => {
                    setSelectedStatus("for_sale");
                    setStatusFilter("for_sale");
                  }}
                  variant="ghost"
                  className={`text-black ${
                    selectedStatus === "for_sale"
                      ? "border-b-2 border-white"
                      : ""
                  }`}
                >
                  For Sale
                </Button>

                <Button
                  onClick={() => {
                    setSelectedStatus("for_rent");
                    setStatusFilter("for_rent");
                  }}
                  variant="ghost"
                  className={`text-black ${
                    selectedStatus === "for_rent"
                      ? "border-b-2 border-white"
                      : ""
                  }`}
                >
                  For Rent
                </Button>
              </div>

              <div className="flex text-gray-600 flex-col md:flex-row gap-3">
                <Input
                  placeholder="Enter Keyword"
                  className="w-full"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />

                {/* Dynamic Types */}
                <Select onValueChange={(value) => setTypeFilter(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type, i) => (
                      <SelectItem key={i} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="bg-[#26415E] text-white hover:bg-gray-800 w-full md:w-auto"
                  onClick={() => {
                    const query = new URLSearchParams({
                      search: keyword || "",
                      type: typeFilter || "",
                      status: statusFilter || "",
                    }).toString();

                    navigate(`/properties/search?${query}`);
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTIES BY CITIES */}
      <section className="max-w-6xl mx-auto px-10 py-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Properties By Cities</h2>

          <a
            href="/all-cities"
            className="text-sm flex font-semibold hover:underline"
          >
            See All Cities
            <MoveUpRight className="text-gray-500 ml-2 w-5 h-5" />
          </a>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.slice(0, 8).map((c, i) => (
            <CityCard
              key={i}
              city={c.city}
              count={c.count}
              image={c.image}
              onClick={() => {
                // Navigate to search page filtered by city
                navigate(`/properties/search?search=${c.city}`);
              }}
              className="cursor-pointer"
            />
          ))}
        </div>
      </section>

      {/* LATEST PROPERTIES */}
      <section className="max-w-6xl mx-auto px-10 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-semibold">Latest Properties</h2>
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-black text-white hover:bg-gray-700"
              onClick={() => navigate("/properties/search?status=for_sale")}
            >
              For Sale
            </Button>

            <Button
              className="bg-black text-white hover:bg-gray-700"
              onClick={() => navigate("/properties/search?status=for_rent")}
            >
              For Rent
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProperties.map((p) => (
            <PropertyCards key={p._id} property={p} />
          ))}
        </div>
      </section>

      <ApartmentTypes propertyTypes={propertyTypes} />

      {/* Agent register */}
      <div className="bg-[#EB67531A]">
        <section className="max-w-6xl mx-auto px-10 py-20">
          <div className="flex flex-col mb-6">
            <h2 className="text-3xl font-semibold">
              Become a Real Estate Agent
            </h2>
            <p className="text-[14px] font-normal mb-[20px]">
              We only work with the best companies around the globe to survey
            </p>
          </div>
          <span>
            <a href="#">
              <Button className="bg-blue-900">
                Register Now <MoveUpRight />
              </Button>
            </a>
          </span>
        </section>
      </div>
      <Footer/>
    </div>
  );
}
