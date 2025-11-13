import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import Pagination from "@/components/Pagination";
import { Plus } from "lucide-react";
import PropertyFilters from "@/components/PropertyFilters";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PropertyCard from "@/components/PropertyCard";

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // show 10 cards per page
  const defaultFilters = {
    status: "any",
    type: "any",
    country: "all",
    state: "all",
    search: "",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const user = useAuth();
  const navigate = useNavigate();

  // Fetch all properties
  const fetchProperties = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
      });

      if (filters.status && filters.status !== "any") {
        params.append("status", filters.status);
      }
      if (filters.type && filters.type !== "any") {
        params.append("type", filters.type);
      }
      if (filters.country && filters.country !== "all") {
        params.append("country", filters.country);
      }
      if (filters.state && filters.state !== "all") {
        params.append("state", filters.state);
      }
      if (filters.search && filters.search.trim() !== "") {
        params.append("search", filters.search.trim());
      }

      const res = await axios.get(`/properties?${params.toString()}`);
      const data = res?.data?.data || res?.data || {};

      setProperties(data.properties || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching properties", error);
    }
  };

  // when either filters or currentPage changes, fetch data
  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    fetchProperties(1); // re-fetch all properties after clearing
  };

  // Navigate to add property page
  const handleAddProperty = () => {
    navigate("/properties/add");
  };

  // Navigate to edit property page
  const handleEditProperty = (property) => {
    const id = property._id || property.id;
    navigate(`/properties/edit/${id}`);
  };

  return (
    <MainLayout>
      <div className="p-6 -ml-[25px] bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Property Listings
          </h2>

          {(user?.user?.role === "Admin" || user?.user?.role === "Agent") && (
            <Button
              onClick={handleAddProperty}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow inline-flex items-center"
            >
              <Plus className="w-4 h-4 text-white mr-2" />
              Add Property
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Property Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              user={user}
              showEdit={true}
              onEdit={handleEditProperty}
            />
          ))}
        </div>
        {/*  Pagination Component */}
        <div className="flex justify-end items-end mt-8 pr-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Property;
