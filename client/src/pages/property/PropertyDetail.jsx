import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import dummyAvatar from "@/assets/dummy-avatar.png";
import PropertyDetailLayout from "@/components/PropertyDetailLayout";

const AgentProfileImage = ({ agentId }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!agentId) return;

    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(`/users/${agentId}/profile-image`, {
          responseType: "blob",
        });
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
      } catch (err) {
        console.error("Error loading agent profile image:", err);
        setImageUrl(dummyAvatar);
      }
    };

    fetchProfileImage();
  }, [agentId]);

  return (
    <img
      src={imageUrl || dummyAvatar}
      alt="Agent"
      className="w-20 h-20 rounded-full object-cover border border-gray-300"
    />
  );
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentPropertiesCount, setAgentPropertiesCount] = useState(0);
  const [locationName, setLocationName] = useState({
    city: "",
    country: "",
    address: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/properties/${id}`);
        const data = res?.data?.data || res?.data;
        setProperty(data);

        // Fetch agent property count
        if (data?.userId?._id) {
          const countRes = await axios.get(
            `/properties?userId=${data.userId._id}`
          );
          const propertiesData = countRes?.data?.data;

          if (propertiesData) {
            setAgentPropertiesCount(propertiesData.totalItems || 0);
          }
        }
        // ✅ Reverse Geocode to fetch city/country from lat/lng
        const lat = data?.location?.mapLocation?.lat;
        const lng = data?.location?.mapLocation?.lng;

        if (lat && lng) {
          try {
            const geoRes = await axios.get(
              `/maps/reverse?lat=${lat}&lon=${lng}`
            );
            const geoData = geoRes.data;
            const address = geoData.address || {};
            setLocationName({
              city:
                address.city ||
                address.town ||
                address.village ||
                address.county ||
                "",
              country: address.country || "",
              address: geoData.display_name || "",
            });
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Loading...</div>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Property not found</div>
      </MainLayout>
    );
  }

  const agent = property.userId || {};

  const lat = property?.location?.mapLocation?.lat;
  const lng = property?.location?.mapLocation?.lng;

  return (
    <MainLayout>
      <PropertyDetailLayout
        property={property}
        agent={agent}
        agentProfileImage={<AgentProfileImage agentId={agent._id} />}
        agentPropertiesCount={agentPropertiesCount}
        locationName={locationName}
        lat={lat}
        lng={lng}
      />
    </MainLayout>
  );
};

export default PropertyDetail;
