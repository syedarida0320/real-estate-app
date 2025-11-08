import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "@/utils/axios";

const PropertyFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("/properties/countries");
        setCountries(res.data.data || []);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (name, value) => {
    onFiltersChange({ ...filters, [name]: value });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-3">
        <div className="relative md:col-span-2 lg:col-span-2 ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Enter an address, city or Zip code"
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-1.5 text-[14px] text-gray-500 focus:outline-none focus:ring-1 "
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any" disabled>
              Any Status
            </SelectItem>
            <SelectItem value="for_sale">For Sale</SelectItem>
            <SelectItem value="for_rent">For Rent</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type}
          onValueChange={(value) => handleChange("type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any" disabled>
              Any Type
            </SelectItem>
            <SelectItem value="Hotel">Hotel</SelectItem>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="House">House</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Garages">Garages</SelectItem>
            <SelectItem value="Lots">Lots</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.country}
          onValueChange={(value) => handleChange("country", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country, idx) => (
              <SelectItem key={idx} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={onClearFilters}
          size="sm"
          className="cursor-pointer border text-gray-600 bg-white border-gray-300 hover:bg-gray-100 flex items-center space-x-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span>Clear Filters</span>
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
