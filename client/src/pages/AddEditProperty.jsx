// src/pages/AddEditProperty.jsx
import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Wifi, Cigarette, Utensils, Car, ArrowLeft } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const AddEditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const user = useAuth();
  
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);

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

  // Handle Input Changes
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

  // Auto-fill agent info when component loads
  useEffect(() => {
    if (user?.user && (user.user.role === "Agent" || user.user.role === "Admin")) {
      setFormData((prev) => ({
        ...prev,
        agent: {
          ...prev.agent,
          name: user.user.name || user.user.firstName || "",
          email: user.user.email || "",
          role: user.user.role || "",
          profileImage: user.user.profileImage || user.user.profileImagePath || "",
        },
      }));
    }
  }, [user]);

  // Fetch property data for edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await axios.get(`/properties/${id}`);
          const p = res?.data?.data || res?.data || {};
          
          setFormData((prev) => ({
            ...prev,
            title: p.title || "",
            type: p.type || "",
            mainImage: p.mainImage || p.image || (p.galleryImages && p.galleryImages[0]) || "",
            galleryImages: p.galleryImages || (p.image ? [p.image] : []),
            priceAmount: p.price?.amount ?? "",
            priceCurrency: p.price?.currency ?? "USD",
            priceDuration: p.price?.duration ?? "Per Day",
            description: p.description || "",
            rating: p.rating ?? "",
            location: {
              address: p.location?.address || "",
              city: p.location?.city || "",
              state: p.location?.state || "",
              country: p.location?.country || "",
            },
            mapLocation: {
              lat: p.location?.mapLocation?.lat ?? (p.mapLocation?.lat ?? ""),
              lng: p.location?.mapLocation?.lng ?? (p.mapLocation?.lng ?? ""),
            },
            facilities: {
              beds: p.facilities?.beds ?? "",
              baths: p.facilities?.baths ?? "",
              area: p.facilities?.area ?? "",
              wifi: Boolean(p.facilities?.wifi),
              smokingArea: Boolean(p.facilities?.smokingArea),
              kitchen: Boolean(p.facilities?.kitchen),
              balcony: Boolean(p.facilities?.balcony),
              parkingArea: Boolean(p.facilities?.parkingArea),
            },
            agent: {
              name:
                (p.userId && (p.userId.firstName ? `${p.userId.firstName} ${p.userId.lastName || ""}` : p.userId.fullName)) ||
                prev?.agent?.name ||
                "",
              email: (p.userId && p.userId.email) || prev?.agent?.email || "",
              role: (p.userId && p.userId.role) || prev?.agent?.role || "",
              contact: {
                phone: p.userId?.phone || prev?.agent?.contact?.phone || "",
                email: p.userId?.email || prev?.agent?.contact?.email || "",
              },
              location: p.userId?.address?.city || prev?.agent?.location || "",
              profileImage: p.userId?.profileImagePath || prev?.agent?.profileImage || "",
            },
          }));
        } catch (error) {
          console.error("Error fetching property:", error);
          alert("Failed to fetch property data");
        }
      };

      fetchProperty();
    }
  }, [id, isEditMode]);

  // Helper to build payload from formData
  const buildPayloadFromForm = () => {
    return {
      title: formData.title,
      type: formData.type,
      mainImage: formData.mainImage,
      galleryImages: formData.galleryImages.filter((img) => img && img.trim() !== ""),
      description: formData.description || "",
      rating: formData.rating || 0,
      price: {
        amount: Number(formData.priceAmount) || 0,
        currency: formData.priceCurrency || "USD",
        duration: formData.priceDuration || "Per Day",
      },
      location: {
        ...formData.location,
        mapLocation: formData.mapLocation,
      },
      facilities: {
        ...formData.facilities,
        beds: Number(formData.facilities.beds) || 0,
        baths: Number(formData.facilities.baths) || 0,
      },
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = buildPayloadFromForm();

      if (isEditMode) {
        await axios.put(`/properties/${id}`, payload);
        alert("✅ Property updated successfully!");
      } else {
        await axios.post("/properties", payload);
        alert("✅ Property added successfully!");
      }
      
      navigate("/properties");
    } catch (error) {
      console.error(`❌ Error ${isEditMode ? "updating" : "adding"} property:`, error);
      alert(`Failed to ${isEditMode ? "update" : "add"} property. Check console.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/properties");
  };

  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Property" : "Add New Property"}
          </h2>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
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
                <div className="grid grid-cols-1 gap-3">
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
                    rows="3"
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
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Processing..." : (isEditMode ? "Update Property" : "Save Property")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddEditProperty;