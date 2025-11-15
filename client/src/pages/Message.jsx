import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Search, Send } from "lucide-react";
import axios from "@/utils/axios";
import { io } from "socket.io-client";
import dummyAvatar from "@/assets/dummy-avatar.png";
const SERVER = import.meta.env.VITE_API || "http://localhost:5000";

let typingTimeout;

const Message = () => {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);

  // Keep ref updated so socket always has the latest user
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    socket.current = io(SERVER, { transports: ["websocket", "polling"] });
    socket.current.emit("registerUser", loggedInUser?._id);

    socket.current.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("typing", (data) => {
      if (selectedUserRef.current?._id === data.senderId) {
        setIsTyping(true);
      }
    });

    socket.current.on("stopTyping", (data) => {
      if (selectedUserRef.current?._id === data.senderId) {
        setIsTyping(false);
      }
    });

    socket.current.on("getMessage", (data) => {
      console.log("Incoming message:", data);

      const currentSelected = selectedUserRef.current;

      // Ensure message is for the open chat
      const isCurrentChat =
        currentSelected &&
        (data.sender === currentSelected._id ||
          data.senderId === currentSelected._id);

      if (data.receiver === loggedInUser?._id) {
        const formattedMessage = {
          _id: Date.now(), // temp id
          text: data.text,
          createdAt: data.timestamp || new Date().toISOString(),
          sender: { _id: data.sender || data.senderId },
        };
        // If the chat is open → show message directly
        if (isCurrentChat) {
          setMessages((prev) => [...prev, formattedMessage]);
        } else {
          // Increment unread count for this sender
          setUnreadCounts((prev) => ({
            ...prev,
            [data.sender]: (prev[data.sender] || 0) + 1,
          }));
        }

        // Update list preview
        setAgents((prev) =>
          prev.map((a) =>
            a._id === data.sender
              ? { ...a, lastMessage: data.text, lastTime: new Date() }
              : a
          )
        );
      }
    });

    return () => socket.current.disconnect();
  }, [loggedInUser?._id]);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("/agents/messaging", {
          params: { userId: loggedInUser._id },
        });
        const fetchedAgents = res.data?.data || [];
        setAgents(fetchedAgents);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, []);

  const handleTyping = () => {
    socket.current.emit("typing", {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
    });

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.current.emit("stopTyping", {
        senderId: loggedInUser._id,
        receiverId: selectedUser._id,
      });
    }, 1000);
  };

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

  // Fetch messages when selecting an agent
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      const convId = await getOrCreateConversation(selectedUser._id);
      setConversationId(convId);
      if (convId) {
        const res = await axios.get(`/messages/conversation/${convId}`);
        setMessages(res.data.data || []);
      }
    };
    fetchMessages();
  }, [selectedUser]);

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
      const sentMsg = res.data.data;
      setMessages((prev) => [...prev, sentMsg]);

      socket.current.emit("sendMessage", {
        senderId: loggedInUser._id,
        receiverId: selectedUser._id,
        text: newMessage,
      });

      // Update last message for that agent
      setAgents((prev) =>
        prev.map((a) =>
          a._id === selectedUser._id
            ? { ...a, lastMessage: sentMsg.text, lastTime: new Date() }
            : a
        )
      );

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sort agents by last message time
  const sortedAgents = [...agents].sort(
    (a, b) => new Date(b.lastTime || 0) - new Date(a.lastTime || 0)
  );

  const filteredAgents = sortedAgents.filter((agent) =>
    agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <MainLayout>
      <h2 className="text-[25px] font-semibold py-2 -ml-[20px] w-full">
        Messages
      </h2>
      <div className="flex h-[calc(100vh-125px)] bg-gray-50 -ml-[20px]">
        {/* LEFT SIDEBAR */}
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
                  onClick={() => {
                    setSelectedUser(agent);
                    setUnreadCounts((prev) => ({ ...prev, [agent._id]: 0 }));
                  }}
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ${
                    selectedUser?._id === agent._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={
                          agent.profileImagePath
                            ? `${SERVER}${agent.profileImagePath}`
                            : dummyAvatar
                        }
                        alt={agent.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          onlineUsers.includes(agent._id)
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                    </div>
                    <div className="flex flex-col">
                      <h3
                        className={`text-sm text-gray-800 ${
                          unreadCounts[agent._id] > 0
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {agent.email}
                      </h3>
                      <p
                        className={`text-xs truncate w-[150px] ${
                          unreadCounts[agent._id] > 0
                            ? "text-gray-800 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {agent.lastMessage || ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-1">
                    <p className="text-[10px] text-gray-400">
                      {formatTime(agent.lastTime)}
                    </p>
                    {unreadCounts[agent._id] > 0 && (
                      <span className="bg-blue-500 text-white text-[10px] px-2 py-[2px] rounded-full">
                        {unreadCounts[agent._id]}
                      </span>
                    )}
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

        {/* RIGHT CHAT SECTION */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* HEADER */}
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
                      {isTyping ? (
                        <span className="text-blue-500 font-medium animate-pulse">
                          Typing...
                        </span>
                      ) : (
                        <>
                          <span
                            className={`inline-block mr-1 w-2 h-2 rounded-full ${
                              onlineUsers.includes(selectedUser._id)
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {onlineUsers.includes(selectedUser._id)
                            ? "Active now"
                            : "Offline"}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => {
                  const isSent =
                    msg.sender?._id === loggedInUser._id ||
                    msg.sender === loggedInUser._id;

                  return (
                    <div
                      key={index}
                      className={`flex mb-2 ${
                        isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col">
                        {!isSent && (
                          <span className="text-xs text-gray-500 mb-1 ml-1">
                            {msg.sender?.email}
                          </span>
                        )}
                        <div
                          className={`relative px-3 py-1 rounded-lg max-w-xs shadow-sm ${
                            isSent
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm break-words">{msg.text}</p>
                          <span
                            className={`block text-[10px] mt-1 ${
                              isSent
                                ? "text-blue-100 text-right"
                                : "text-gray-500 text-left"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="p-4 flex items-center space-x-3 bg-white">
                <input
                  type="text"
                  placeholder="Write a message..."
                  className="flex-1 bg-[#f2f2f2] border border-[#E4E4E4] rounded-xl px-4 py-2 text-sm focus:outline-none"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
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
