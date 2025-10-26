// src/pages/AddEditProperty.jsx
import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker,useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Wifi, Cigarette, Utensils, Car, ArrowLeft, Search } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

 // 🧭 Subcomponent to handle map clicks
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          mapLocation: { lat: lat.toFixed(6), lng: lng.toFixed(6) },
        }));
      },
    });

    return formData.mapLocation.lat && formData.mapLocation.lng ? (
      <Marker
        position={[
          parseFloat(formData.mapLocation.lat),
          parseFloat(formData.mapLocation.lng),
        ]}
      />
    ) : null;
  }

// 🧭 Component to control map view programmatically
  function MapUpdater({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.setView([lat, lng], 13);
      }
    }, [lat, lng, map]);
    return null;
  }

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

  // 📍 Location Search Feature (Geocoding)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setFormData((prev) => ({
          ...prev,
          mapLocation: { lat: parseFloat(lat).toFixed(6), lng: parseFloat(lon).toFixed(6) },
          location: { ...prev.location, address: display_name || "" },
        }));
      } else {
        alert("Location not found. Try a different search.");
      }
    } catch (error) {
      console.error("Error during location search:", error);
      alert("Failed to fetch location.");
    } finally {
      setSearchLoading(false);
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
            ...p,
            title: p.title || "",
            type: p.type || "",
            mainImage: p.mainImage || p.image || (p.galleryImages && p.galleryImages[0]) || "",
            galleryImages: p.galleryImages || (p.image ? [p.image] : []),
            priceAmount: p.price?.amount ?? "",
            priceCurrency: p.price?.currency ?? "USD",
            priceDuration: p.price?.duration ?? "Per Day",
            description: p.description || "",
            location: {
              address: p.location?.address || "",
              city: p.location?.city || "",
              state: p.location?.state || "",
              country: p.location?.country || "",
            },
            mapLocation: {
              lat: p.location?.mapLocation?.lat ?? "",
              lng: p.location?.mapLocation?.lng  ?? "",
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
                    className="w-full border border-gray-300 rounded-[2px] h-10 px-3"
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
                    className="w-full border border-gray-300 rounded-[2px] h-10 px-3"
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
                  className="w-full border border-gray-300 rounded-[2px] h-10 px-3"
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
                  className="w-full border border-gray-300 rounded-[2px] h-10 px-3"
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
                    className="border border-gray-300 rounded-[2px] h-10 px-3"
                    required
                  />
                  <select
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[2px] h-10 px-3"
                  >
                    <option value="USD">USD</option>
                    <option value="PKR">PKR</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <select
                    name="priceDuration"
                    value={formData.priceDuration}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[2px] h-10 px-3"
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
                      className="border border-gray-300 rounded-[2px] h-10 px-3"
                    />
                  ))}
                </div>
              </div>

              {/* 🗺️ Map Section */}
              <div className="flex items-center gap-2 mb-3">
              {/* <label className="block text-sm font-semibold mb-2">
                Search Location (if not visible on map)
              </label> */}
              <input
                type="text"
                placeholder="Search city, address, or landmark"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
              type="button"
                onClick={handleLocationSearch}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={searchLoading}
              >
                  <Search className="w-4 h-4 mr-1" />
                  {searchLoading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* 🗺️ Map Section */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Click on Map to Select Location
              </label>
              <MapContainer
                center={[
                  formData.mapLocation.lat || 30.3753,
                  formData.mapLocation.lng || 69.3451,
                ]}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: "350px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
                <MapUpdater
                  lat={parseFloat(formData.mapLocation.lat)}
                  lng={parseFloat(formData.mapLocation.lng)}
                />
              </MapContainer>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  name="mapLocation.lat"
                  type="text"
                  placeholder="Latitude"
                  value={formData.mapLocation.lat}
                  readOnly
                  className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                  name="mapLocation.lng"
                  type="text"
                  placeholder="Longitude"
                  value={formData.mapLocation.lng}
                  readOnly
                  className="border border-gray-300 rounded px-3 py-2"
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
                    className="border border-gray-300 rounded-[2px] h-10 px-3"
                  />
                  <input
                    name="facilities.baths"
                    type="number"
                    placeholder="Baths"
                    value={formData.facilities.baths}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[2px] h-10 px-3"
                  />
                  <input
                    name="facilities.area"
                    type="text"
                    placeholder="Area (sqft)"
                    value={formData.facilities.area}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[2px] h-10 px-3"
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

              {/* Description */}
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold mb-2">
                  Additional Info
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <textarea
                    name="description"
                    placeholder="Description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[2px] px-3 py-2"
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
                    className="border border-gray-300 rounded-[2px] h-10 px-3 w-full bg-gray-100"
                  />
                  <input
                    name="agent.email"
                    type="text"
                    placeholder="Agent Email"
                    value={formData.agent.email}
                    readOnly
                    className="border rounded-[2px] border-gray-300 h-10 px-3 w-full bg-gray-100"
                  />
                  <input
                    name="agent.contact.phone"
                    type="text"
                    placeholder="Phone"
                    value={formData.agent.contact.phone}
                    onChange={handleChange}
                    className="border rounded-[2px] border-gray-300 h-10 px-3 w-full"
                  />
                  <input
                    name="agent.location"
                    type="text"
                    placeholder="Agent Location"
                    value={formData.agent.location}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[2px] h-10 px-3 w-full"
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