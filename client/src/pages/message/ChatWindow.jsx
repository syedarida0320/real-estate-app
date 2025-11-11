// src/ui/ChatWindow.jsx
import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "@/pages/message/MessageBubble";

export default function ChatWindow({ activeConv, messages = [], onSend }) {
  const bottomRef = useRef();
  const [text, setText] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConv]);

  const handleSend = () => {
    if (!text.trim()) return;
    // determine receiver id from conversation participants
    const receiver = activeConv.participants.find(p => p._id !== (localStorage.getItem("userId") || ""));
    onSend({ conversationId: activeConv._id, text: text.trim(), receiverId: receiver?._id });
    setText("");
  };

  if (!activeConv) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-gray-400">Select a conversation to view messages</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* header */}
      <div className="px-6 py-4 border-b flex items-center">
        <img
          className="w-12 h-12 rounded-full mr-4 object-cover"
          src={`https://ui-avatars.com/api/?name=${activeConv.participants[1]?.name || "User"}`}
          alt="avatar"
        />
        <div>
          <div className="font-semibold">{activeConv.participants[1]?.name || "User"}</div>
          <div className="text-sm text-gray-500">Active Now</div>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {messages.map((m) => (
            <MessageBubble key={m._id || m.createdAt} message={m} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* composer */}
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message down here..."
            className="flex-1 rounded-full border px-4 py-2 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}