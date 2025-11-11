// src/ui/ConversationList.jsx
import React from "react";
import dayjs from "dayjs";

export default function ConversationList({ conversations = [], activeConv, onSelect }) {
  return (
    <div className="w-80 border-r p-4 flex flex-col">
      <div className="mb-4">
        <div className="text-2xl font-semibold">Messages</div>
      </div>

      <div className="flex-1 overflow-auto">
        {conversations.map((conv) => {
          const other = conv.participants && conv.participants.find(p => p._id !== (localStorage.getItem('userId') || ""));
          const last = conv.lastMessage;
          return (
            <div
              key={conv._id}
              onClick={() => onSelect(conv)}
              className={`p-3 rounded-lg flex items-center cursor-pointer mb-2 ${
                activeConv && activeConv._id === conv._id ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              <img
                src={(other && other.avatar) || `https://ui-avatars.com/api/?name=${other?.name || "U"}`}
                alt="avatar"
                className="w-12 h-12 rounded-full mr-3 object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{other?.name || "Unknown"}</div>
                  <div className="text-xs">{last ? dayjs(last.createdAt).format("hh:mm A") : ""}</div>
                </div>
                <div className="text-sm truncate">
                  {last ? (last.text.length > 40 ? last.text.slice(0, 40) + "..." : last.text) : "No messages yet"}
                </div>
              </div>
              {conv.unreadCount > 0 && (
                <div className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {conv.unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}