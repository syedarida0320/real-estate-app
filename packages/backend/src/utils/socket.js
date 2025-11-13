const { Server } = require("socket.io");

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
      }
    });

    // ✅ Notify only — no DB save here
    socket.on("sendMessage", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", {
          senderId: data.senderId,
          text: data.text,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

module.exports = initSocket;
