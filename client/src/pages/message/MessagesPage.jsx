// src/pages/MessagesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import ConversationList from "@/pages/message/ConversationList"
import ChatWindow from "@/pages/message/ChatWindow";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get("/conversations");
      setConversations(data.data || []);
      if (!activeConv && data.data && data.data.length) setActiveConv(data.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConversationMessages = async (convId) => {
    try {
      const { data } = await axios.get(`/conversation/${convId}`);
      setMessages(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchConversationMessages(activeConv._id);
    } else {
      setMessages([]);
    }
  }, [activeConv]);

  // handler to send new message and refresh
  const handleSend = async ({ conversationId, text, receiverId }) => {
    try {
      const { data } = await axios.post("/send", { conversationId, text, receiverId });
      // Add to messages UI
      setMessages((m) => [...m, data.data]);
      // refresh conversation list to update lastMessage
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="container mx-auto h-full p-4">
        <div className="bg-white rounded-2xl shadow h-full flex overflow-hidden">
          <ConversationList
            conversations={conversations}
            activeConv={activeConv}
            onSelect={(c) => setActiveConv(c)}
          />
          <ChatWindow
            activeConv={activeConv}
            messages={messages}
            onSend={handleSend}
            reloadConversations={fetchConversations}
          />
        </div>
      </div>
    </div>
  );
}