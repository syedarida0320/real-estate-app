import React, { useState, useEffect } from "react";
import axios from "@/utils/axios";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Wifi,
  Cigarette,
  Utensils,
  Car,
  ArrowLeft,
  Search,
  Upload,
  Asterisk,
  X,
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";

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
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    availabilityType: "",
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
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const debouncedLat = useDebounce(formData.mapLocation.lat, 1000);
  const debouncedLng = useDebounce(formData.mapLocation.lng, 1000);

  useEffect(() => {
    return () => {
      if (formData.mainImage?.startsWith("blob:"))
        URL.revokeObjectURL(formData.mainImage);
      formData.galleryImages.forEach((img) => {
        if (img.startsWith("blob:")) URL.revokeObjectURL(img);
      });
    };
  }, []);

  // Common function to fetch and update location details
  const fetchAndSetLocationDetails = async (lat, lng) => {
    try {
      const res = await axios.get(`/maps/reverse`, {
        params: { lat, lon: lng },
      });
      const data = res.data;
      const address = data.address || {};
      const city =
        address.city || address.town || address.village || address.county || "";
      const country = address.country || "";

      // Update location in state
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          city,
          country,
          address: data.display_name || prev.location.address,
        },
      }));
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  // Subcomponent to handle map clicks
  function LocationMarker() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          mapLocation: { lat: lat.toFixed(6), lng: lng.toFixed(6) },
        }));
        await fetchAndSetLocationDetails(lat, lng);
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

  // Component to control map view programmatically
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
    if (
      (name === "priceAmount" ||
        name === "facilities.beds" ||
        name === "facilities.baths" ||
        name === "facilities.area") &&
      Number(value) < 0
    ) {
      return; // ignore update if below zero
    }
    if (name.includes(".")) {
      const [key, subkey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [subkey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);

    // Create temporary preview URL (not uploaded yet)
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, mainImage: previewUrl }));
  };

  //  Handle Gallery Images Upload (Temporary Preview Only)
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setGalleryFiles((prev) => [...prev, ...files]);

    // Generate preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...previewUrls],
    }));
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);

    try {
      const res = await axios.get(`/maps/search`, {
        params: { q: searchQuery },
      });
      const data = res.data;

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setFormData((prev) => ({
          ...prev,
          mapLocation: {
            lat: parseFloat(lat).toFixed(6),
            lng: parseFloat(lon).toFixed(6),
          },
          location: { ...prev.location, address: display_name || "" },
        }));
      } else {
        alert("Location not found. Try a different search.");
      }
    } catch (error) {
      console.error("Error during location search:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch property data for edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await axios.get(`/properties/${id}`);
          const p = res.data.data || res.data || {};
          setFormData((prev) => ({
            ...prev,
            ...p,
            title: p.title || "",
            type: p.type || "",
            mainImage:
              p.mainImage ||
              p.image ||
              (p.galleryImages && p.galleryImages[0]) ||
              "",
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
              lng: p.location?.mapLocation?.lng ?? "",
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
          }));
        } catch (error) {
          console.error("Error fetching property:", error);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode]);

  // 🧭 Auto-update city/country when lat/lng change manually
  useEffect(() => {
    if (!debouncedLat || !debouncedLng) return;

    fetchAndSetLocationDetails(debouncedLat, debouncedLng);
  }, [debouncedLat, debouncedLng]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Step 1: Prepare FormData
      const data = new FormData();
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("availabilityType", formData.availabilityType);
      data.append("description", formData.description);

      data.append(
        "price",
        JSON.stringify({
          amount: formData.priceAmount,
          currency: formData.priceCurrency,
          duration: formData.priceDuration,
        })
      );

      data.append(
        "location",
        JSON.stringify({
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
          mapLocation: {
            lat: formData.mapLocation.lat,
            lng: formData.mapLocation.lng,
          },
        })
      );

      data.append("facilities", JSON.stringify(formData.facilities));

      // ✅ Main Image
      if (mainImageFile) {
        data.append("mainImage", mainImageFile); // newly uploaded
      } else if (formData.mainImage) {
        data.append("mainImageUrl", formData.mainImage); // existing image URL
      }

      // ✅ Gallery Images
      galleryFiles.forEach((file) => data.append("galleryImages", file));
      formData.galleryImages.forEach((img) => {
        if (!img.startsWith("blob:")) data.append("existingGalleryImages", img);
      });

      // ✅ Step 2: Send full FormData directly
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEditMode) {
        await axios.put(`/properties/${id}`, data, config);
        toast.success("Property updated successfully!");
      } else {
        await axios.post("/properties", data, config);
        toast.success("Property added successfully!");
      }

      handleBack();
    } catch (error) {
      console.log("Validation errors:", error.response?.data?.errors);

      console.error(" Error submitting property:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while adding the property."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/properties");
  };

  return (
    <MainLayout>
      {/* <ToastContainer/> */}
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="mr-4 cursor-pointer">
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
              {/* 🏞️ Main Image Upload Section */}
              <div className="space-y-2">
                <label className="text-sm flex font-medium text-gray-700 mb-1">
                  Main Image{" "}
                  <span>
                    <Asterisk className="text-red-500 size-3" />
                  </span>
                </label>

                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center hover:border-blue-500 transition group">
                  {formData.mainImage ? (
                    <div className="relative group">
                      <img
                        src={
                          formData.mainImage.startsWith("blob:")
                            ? formData.mainImage
                            : `http://localhost:5000/${formData.mainImage}`
                        }
                        alt="Main"
                        className="w-45 h-30 object-cover rounded-lg shadow-md"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, mainImage: "" }))
                        }
                        className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-gray-500 m-2" />
                      <p className="text-gray-500 text-sm text-center">
                        Drag & drop or click to upload
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
                {errors.mainImage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mainImage}
                  </p>
                )}
              </div>

              {/* 🖼️ Gallery Images Upload Section */}
              <div className="space-y-2 mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gallery Images
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 relative hover:border-blue-500 transition">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.galleryImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={
                            img.startsWith("blob:")
                              ? img
                              : `http://localhost:5000/${img}`
                          }
                          alt={`Gallery ${index}`}
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              galleryImages: prev.galleryImages.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                          className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}

                    {/* Upload new image box */}
                    <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <Upload className="text-gray-500 m-2" />
                      <p className="text-gray-500 text-xs">Add more images</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="flex text-sm font-medium mb-1">
                    Title
                    <span>
                      <Asterisk className="text-red-500 size-3" />
                    </span>{" "}
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
                  <label className="flex text-sm font-medium mb-1">
                    Availability Type{" "}
                    <Asterisk className="text-red-500 size-3" />
                  </label>
                  <select
                    name="availabilityType"
                    value={formData.availabilityType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-[2px] h-10 px-3"
                    required
                  >
                    <option value="">Select Availability</option>
                    <option value="for_rent">For Rent</option>
                    <option value="for_sale">For Sale</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="flex text-sm font-medium mb-1">
                    Property Type{" "}
                    <span>
                      <Asterisk className="text-red-500 size-3" />
                    </span>
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

              {/* Price Section */}
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Price
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="flex text-sm font-medium mb-1">
                      Amount{" "}
                      <span>
                        <Asterisk className="text-red-500 size-3" />
                      </span>
                    </label>
                    <input
                      name="priceAmount"
                      type="number"
                      placeholder="Enter Amount"
                      value={formData.priceAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priceAmount: e.target.value,
                        })
                      }
                      min="0"
                      step="any"
                      className="border border-gray-300 rounded-[2px] h-10 px-3 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Currency
                    </label>
                    <select
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priceCurrency: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-[2px] h-10 px-3 w-full"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PKR">PKR (₨)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  {/* ✅ Show duration only when for_rent */}
                  {formData.availabilityType === "for_rent" && (
                    <div>
                      <label className="text-sm font-medium">Duration</label>
                      <select
                        value={formData.priceDuration}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priceDuration: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="Per Day">Per Day</option>
                        <option value="Per Month">Per Month</option>
                        <option value="Per Year">Per Year</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="border-t pt-4">
                <label className="block text-lg font-semibold mb-3">
                  Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <input
                      name="location.country"
                      type="text"
                      placeholder="Country"
                      value={formData.location.country}
                      onChange={handleChange}
                      className="border border-gray-300 w-full rounded-[2px] h-10 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      name="location.city"
                      type="text"
                      placeholder="City"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="border border-gray-300 w-full rounded-[2px] h-10 px-3"
                    />
                  </div>
                </div>
              </div>
              {/* 🗺️ Map Section */}
              <div className="flex items-center gap-2 mb-3">
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
                  className="cursor-pointer flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
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
                  style={{
                    height: "350px",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                  <MapUpdater
                    lat={parseFloat(formData.mapLocation.lat)}
                    lng={parseFloat(formData.mapLocation.lng)}
                  />
                </MapContainer>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Latitude
                    </label>
                    <input
                      name="mapLocation.lat"
                      type="number"
                      placeholder="Latitude"
                      value={formData.mapLocation.lat}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          mapLocation: { ...prev.mapLocation, lat: value },
                        }));
                      }}
                      className="border w-full border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Longitude
                    </label>
                    <input
                      name="mapLocation.lng"
                      type="number"
                      placeholder="Longitude"
                      value={formData.mapLocation.lng}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          mapLocation: { ...prev.mapLocation, lng: value },
                        }));
                      }}
                      className="border w-full border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="border-t pt-4">
                <label className="block text-lg font-semibold mb-4">
                  Facilities
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Beds
                    </label>
                    <input
                      name="facilities.beds"
                      type="number"
                      placeholder="Beds"
                      value={formData.facilities.beds}
                      onChange={handleChange}
                      className="border border-gray-300 w-full rounded-[2px] h-10 px-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Baths
                    </label>
                    <input
                      name="facilities.baths"
                      type="number"
                      placeholder="Baths"
                      value={formData.facilities.baths}
                      onChange={handleChange}
                      className="border border-gray-300 w-full rounded-[2px] h-10 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Area (sqft)
                    </label>
                    <input
                      name="facilities.area"
                      type="number"
                      placeholder="Area (sqft)"
                      value={formData.facilities.area}
                      onChange={handleChange}
                      className="border border-gray-300 w-full rounded-[2px] h-10 px-3"
                    />
                  </div>
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
                  Description
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

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4 mt-4">
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer bg-blue-600 text-white"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isEditMode
                    ? "Update Property"
                    : "Save Property"}
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
