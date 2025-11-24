const { Server } = require("socket.io");
const { sendMessageSocket } = require("../controllers/message.controller");

// Store online users
const onlineUsers = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    transports: ["websocket", "polling"],
    cors: {
      origin: "*", // Can restrict to our frontend URL if needed
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "User connected:",
      socket.id,
      "Transport:",
      socket.conn.transport.name
    );

    // When a user joins/registers
    socket.on("registerUser", (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log(`User registered: ${userId}`);

        // Broadcast updated online user IDs
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
    });

     socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { senderId });
      }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("stopTyping", { senderId });
      }
    });

    // Handle message sending
    socket.on("sendMessage", (data) => {
      const { senderId, receiverId, text } = data;
      console.log("sendMessage event:", data);

      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        // send message to receiver
        io.to(receiverSocket).emit("getMessage", {
          sender: senderId,
          receiver: receiverId,
          text,
          timestamp: new Date(),
        });
      }

      // also send confirmation back to sender
      io.to(socket.id).emit("messageSent", {
        sender: senderId,
        receiver: receiverId,
        text,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      // Broadcast updated online user IDs
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

module.exports = initSocket;
