import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const PropertyFilters = ({ filters, onFiltersChange }) => {
  const handleChange = (name, value) => {
    onFiltersChange({ ...filters, [name]: value });
  };

  return (
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
          <SelectItem value="any">Any Status</SelectItem>
          <SelectItem value="for sale">For Sale</SelectItem>
          <SelectItem value="for rent">For Rent</SelectItem>
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
          <SelectItem value="any">Any Type</SelectItem>
          <SelectItem value="hotel">Hotel</SelectItem>
          <SelectItem value="apartment">Apartment</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
          <SelectItem value="garages">Garages</SelectItem>
          <SelectItem value="lots">Lots</SelectItem>
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
          <SelectItem value="USA">USA</SelectItem>
          <SelectItem value="UK">UK</SelectItem>
          <SelectItem value="India">India</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.state}
        onValueChange={(value) => handleChange("state", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          <SelectItem value="California">California</SelectItem>
          <SelectItem value="Texas">Texas</SelectItem>
          <SelectItem value="North Carolina">North Carolina</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertyFilters;
