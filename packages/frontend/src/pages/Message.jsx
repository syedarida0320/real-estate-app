import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Search, Send } from "lucide-react";
import axios from "@/utils/axios";
import { io } from "socket.io-client";
import dummyAvatar from "@/assets/dummy-avatar.png";

const SERVER = import.meta.env.VITE_API || "http://localhost:5000";

const Message = () => {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // Connect socket when component mounts
  useEffect(() => {
    socket.current = io(SERVER, { transports: ["websocket", "polling"] });

    socket.current.emit("registerUser", loggedInUser?._id);

    socket.current.on("getMessage", (data) => {
      if (data && data.senderId && data.text) {
        setMessages((prev) => [
          ...prev,
          { sender: data.senderId, text: data.text },
        ]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [loggedInUser?._id]);

  // ✅ Fetch all agents dynamically

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("/agents/messaging", {
          params: { userId: loggedInUser._id }, // fallback if token not handled
        });

        // Backend already excludes logged-in user
        const fetchedAgents = res.data?.data || [];

        // (Optional) small safeguard: exclude logged-in user again on client
        const filteredAgents = fetchedAgents.filter(
          (agent) => agent._id !== loggedInUser._id
        );

        setAgents(filteredAgents);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };

    if (loggedInUser?._id) fetchAgents();
  }, [loggedInUser?._id]);

  // ✅ Find or create conversation between user and agent
  const getOrCreateConversation = async (receiverId) => {
    try {
      const res = await axios.post("/conversations", {
        senderId: loggedInUser._id,
        receiverId,
      });
      setConversationId(res.data._id);
      return res.data._id;
    } catch (error) {
      console.error("Error in conversation:", error);
    }
  };

  // ✅ Fetch messages when an agent is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        // get or create conversation first
        const convId = await getOrCreateConversation(selectedUser._id);
        setConversationId(convId);

        if (convId) {
          const res = await axios.get(`/messages/conversation/${convId}`);
          setMessages(res.data.data || res.data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const messageData = {
      sender: loggedInUser._id,
      receiver: selectedUser._id,
      text: newMessage,
      conversationId,
    };

    try {
      const res = await axios.post("/messages/send", messageData);
      setMessages((prev) => [...prev, res.data.data]);

      // emit message via socket
      socket.current.emit("sendMessage", {
        senderId: loggedInUser._id,
        receiverId: selectedUser._id,
        text: newMessage,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredAgents = agents.filter((agent) =>
    agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <h2 className="text-[25px] font-semibold py-2 -ml-[20px] w-full">
        Messages
      </h2>
      <div className="flex h-[calc(100vh-125px)] bg-gray-50 -ml-[20px]">
        {/* Left Sidebar: Agent List */}
        <div className="w-1/3 border-r bg-white flex flex-col">
          <div className="p-5 border-b">
            <div className="flex items-center border border-gray-300 px-3 py-3 rounded-lg">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search by email..."
                className="ml-2 w-full bg-transparent text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <div
                  key={agent._id}
                  onClick={() => setSelectedUser(agent)}
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedUser?._id === agent._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        agent.profileImagePath
                          ? `${SERVER}${agent.profileImagePath}`
                          : dummyAvatar
                      }
                      alt={agent.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">
                        {agent.firstName} {agent.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {agent.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-10 text-sm">
                No agents found.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      selectedUser.profileImagePath
                        ? `${SERVER}${selectedUser.profileImagePath}`
                        : dummyAvatar
                    }
                    alt={selectedUser.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-2 ${
                      msg.sender?._id === loggedInUser._id ||
                      msg.sender === loggedInUser._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.sender?._id === loggedInUser._id ||
                        msg.sender === loggedInUser._id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 flex items-center space-x-3 bg-white">
                <input
                  type="text"
                  placeholder="Write a message..."
                  className="flex-1 bg-[#f2f2f2] border border-[#E4E4E4] rounded-xl px-4 py-2 text-sm focus:outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Select an agent to start chatting
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Message;
