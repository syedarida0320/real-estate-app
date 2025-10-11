// src/pages/Property.jsx
import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import {
  MapPin,
  BedDouble,
  MoveDiagonal,
  Plus,
  Bath,
  Wifi,
  Cigarette,
  Utensils,
  Car,
} from "lucide-react";
import PropertyFilters from "@/components/PropertyFilters";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    status: "any",
    type: "any",
    country: "all",
    state: "all",
    search: "",
  });

  const user = useAuth();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    mainImage: "",
    galleryImages: [],
    priceAmount: "",
    priceCurrency: "USD",
    priceDuration: "Per Day",
    description: "",
    rating: "",
    location: { address: "", city: "", state: "", country: "" },
    mapLocation: { lat: "", lng: "" },
    facilities: {
      beds: "",
      baths: "",
      area: "",
      wifi: false,
      smokingArea: false,
      kitchen: false,
      balcony: false,
      parkingArea: false,
    },
    agent: {
      name: "",
      email: "",
      role: "",
      contact: { phone: "", email: "" },
      location: "",
      profileImage: "",
    },
  });

  // 🏘️ Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/properties");
        const data = res?.data?.data || res?.data || [];
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };
    fetchProperties();
  }, []);

  // 🧾 Auto-fill agent info when form opens
  useEffect(() => {
    if (
      user?.user &&
      (user.user.role === "agent" || user.user.role === "admin")
    ) {
      setFormData((prev) => ({
        ...prev,
        agent: {
          ...prev.agent,
          name: user.user.name || "",
          email: user.user.email || "",
          role: user.user.role || "",
          profileImage: user.user.profileImage || "",
        },
      }));
    }
  }, [user]);

  // 🧩 Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [key, subkey, subsubkey] = name.split(".");
      setFormData((prev) => {
        if (subsubkey) {
          return {
            ...prev,
            [key]: {
              ...prev[key],
              [subkey]: { ...prev[key][subkey], [subsubkey]: value },
            },
          };
        }
        return {
          ...prev,
          [key]: {
            ...prev[key],
            [subkey]: type === "checkbox" ? checked : value,
          },
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // 🏠 Add property
  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        mainImage: formData.mainImage,
        galleryImages: formData.galleryImages.filter(
          (img) => img.trim() !== ""
        ),
        description: formData.description || "",
        rating: formData.rating || "",
        price: {
          amount: Number(formData.priceAmount),
          currency: formData.priceCurrency || "USD",
          duration: formData.priceDuration || "Per Day",
        },
        location: {
          ...formData.location,
          mapLocation: formData.mapLocation, // ✅ nest coordinates inside location
        },
        facilities: formData.facilities,
      };

      await axios.post("/properties", payload);
      alert("✅ Property added successfully!");
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("❌ Error adding property:", error);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Property Listings
          </h2>

          {(user?.user?.role === "admin" || user?.user?.role === "agent") && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow inline-flex items-center"
            >
              <Plus className="w-4 h-4 text-white mr-2" />
              Add Property
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Add Property Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-semibold mb-4">Add Property</h3>

              <form
                onSubmit={handleAddProperty}
                className="space-y-6 text-gray-800"
              >
                {/* Title & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Enter property title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Property Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    >
                      <option value="">Select Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Garages">Garages</option>
                      <option value="Lots">Lots</option>
                    </select>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Main Image URL
                  </label>
                  <input
                    name="mainImage"
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formData.mainImage}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gallery Images (comma separated)
                  </label>
                  <input
                    name="galleryImages"
                    type="text"
                    placeholder="https://img1.jpg, https://img2.jpg"
                    value={formData.galleryImages.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        galleryImages: e.target.value
                          .split(",")
                          .map((url) => url.trim()),
                      })
                    }
                    className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                  />
                </div>

                {/* Price Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      name="priceAmount"
                      type="number"
                      placeholder="Amount"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                      required
                    />
                    <select
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    >
                      <option value="USD">USD</option>
                      <option value="PKR">PKR</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <select
                      name="priceDuration"
                      value={formData.priceDuration}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    >
                      <option value="Per Day">Per Day</option>
                      <option value="Per Month">Per Month</option>
                      <option value="Per Year">Per Year</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Location
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["city", "country"].map((field) => (
                      <input
                        key={field}
                        name={`location.${field}`}
                        type="text"
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={formData.location[field]}
                        onChange={handleChange}
                        className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                      />
                    ))}
                  </div>
                </div>

                {/* Map Location */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Map Location
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="mapLocation.lat"
                      type="text"
                      placeholder="Latitude"
                      value={formData.mapLocation.lat}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    />
                    <input
                      name="mapLocation.lng"
                      type="text"
                      placeholder="Longitude"
                      value={formData.mapLocation.lng}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    />
                  </div>
                </div>

                {/* Facilities */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Facilities
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      name="facilities.beds"
                      type="number"
                      placeholder="Beds"
                      value={formData.facilities.beds}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    />
                    <input
                      name="facilities.baths"
                      type="number"
                      placeholder="Baths"
                      value={formData.facilities.baths}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    />
                    <input
                      name="facilities.area"
                      type="text"
                      placeholder="Area (sqft)"
                      value={formData.facilities.area}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    {[
                      {
                        key: "wifi",
                        label: "Wi-Fi",
                        icon: <Wifi className="w-4 h-4" />,
                      },
                      {
                        key: "smokingArea",
                        label: "Smoking Area",
                        icon: <Cigarette className="w-4 h-4" />,
                      },
                      {
                        key: "kitchen",
                        label: "Kitchen",
                        icon: <Utensils className="w-4 h-4" />,
                      },
                      { key: "balcony", label: "Balcony" },
                      {
                        key: "parkingArea",
                        label: "Parking",
                        icon: <Car className="w-4 h-4" />,
                      },
                    ].map(({ key, label, icon }) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name={`facilities.${key}`}
                          checked={formData.facilities[key]}
                          onChange={handleChange}
                          className="accent-blue-600"
                        />
                        {icon}
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating & Description */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Additional Info
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="rating"
                      type="number"
                      placeholder="Rating (0–5)"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg h-10 px-3"
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      rows="2"
                      value={formData.description}
                      onChange={handleChange}
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2"
                    ></textarea>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Agent Details
                  </label>
                  <div className="space-y-2">
                    <input
                      name="agent.name"
                      type="text"
                      placeholder="Agent Name"
                      value={formData.agent.name}
                      readOnly
                      className="border rounded-lg h-10 px-3 w-full bg-gray-100"
                    />
                    <input
                      name="agent.email"
                      type="text"
                      placeholder="Agent Email"
                      value={formData.agent.email}
                      readOnly
                      className="border rounded-lg h-10 px-3 w-full bg-gray-100"
                    />
                    <input
                      name="agent.contact.phone"
                      type="text"
                      placeholder="Phone"
                      value={formData.agent.contact.phone}
                      onChange={handleChange}
                      className="border rounded-lg h-10 px-3 w-full"
                    />
                    <input
                      name="agent.location"
                      type="text"
                      placeholder="Agent Location"
                      value={formData.agent.location}
                      onChange={handleChange}
                      className="border rounded-lg h-10 px-3 w-full"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 text-white">
                    Save Property
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Property Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {properties.map((property) => {
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
                ? `http://localhost:5000${img}`
                : "/placeholder.png";

            return (
              <Link key={id} to={`/properties/${id}`} className="group">
                <Card className="rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col md:flex-row bg-white p-0">
                  <div className="w-full md:w-1/2 h-56 md:h-40 flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardContent className="w-full md:w-1/2 py-4 px-1 relative flex flex-col justify-between">
                    <Badge className="absolute top-1 bg-[#DADEFA] text-blue-600 font-semibold text-[12px] rounded px-3 py-1 shadow">
                      {property.price?.currency || "USD"}
                      {property.price?.amount ?? ""}
                    </Badge>

                    <div className="pl-0">
                      <h3 className="mt-6 md:mt-5 text-[15px] leading-6 font-semibold text-gray-800 mb-0.5">
                        {property.title}
                      </h3>

                      <div className="flex items-center text-sm text-gray-500 mb-1.5">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        <span>
                          {property.location?.city
                            ? `${property.location.city}, ${
                                property.location?.country || ""
                              }`
                            : "Unknown location"}
                        </span>
                      </div>

                      <div className="flex space-x-4 text-sm text-gray-600">
                        <div className="flex items-center text-[12px] gap-2">
                          <BedDouble className="w-4 h-4" />
                          {property.facilities?.beds ?? 0} Beds
                        </div>
                        <div className="flex items-center text-[12px] gap-1">
                          <MoveDiagonal className="w-4 h-4" />
                          {property.facilities?.area ?? "-"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      Click to view details
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Property;
