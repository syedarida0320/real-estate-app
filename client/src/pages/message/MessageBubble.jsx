// src/ui/MessageBubble.jsx
import React from "react";
import dayjs from "dayjs";

export default function MessageBubble({ message }) {
  const meId = localStorage.getItem("userId") || ""; // set this when user logs in
  const isMine = message.sender && message.sender._id === meId;

  const containerClass = isMine ? "justify-end" : "justify-start";
  const bubbleClass = isMine ? "bg-blue-600 text-white" : "bg-white border";

  return (
    <div className={`flex ${containerClass} mb-4`}>
      <div className={`max-w-[70%] p-3 rounded-xl shadow ${bubbleClass}`}>
        {message.messageType === "image" ? (
          <img src={message.text} alt="sent" className="w-56 h-36 object-cover rounded-md" />
        ) : (
          <div>{message.text}</div>
        )}
        <div className={`text-xs mt-2 ${isMine ? "text-blue-100" : "text-gray-400"}`}>
          {dayjs(message.createdAt).format("hh:mm A")}
        </div>
      </div>
    </div>
  );
}