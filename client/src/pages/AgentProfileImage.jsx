import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import dummyAvatar from "@/assets/dummy-avatar.png";

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

export default AgentProfileImage;
