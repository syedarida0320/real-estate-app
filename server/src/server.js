const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const path = require("path");
const uploads = require("./routes/upload.routes");
const http = require("http");
const { Server } = require("socket.io");
// ✅ Save message in MongoDB
const Message = require("./models/Message");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true })); // Needed to parse FormData

// ✅ Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/properties", require("./routes/property.routes"));
app.use("/api/agents", require("./routes/agent.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api", require("./routes/email.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/maps", require("./routes/map.routes"));
app.use("/api/conversations", require("./routes/conversation.routes"))
app.use("/api/messages", require("./routes/message.routes"))
app.use("/api/upload", uploads);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static("public/images"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // or specific origin: ["http://localhost:5173"]
    methods: ["GET", "POST"],
  },
});

// ✅ Store online users (socket.id <-> userId)
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user when they join
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Handle private message
  socket.on("privateMessage", async (data) => {
    const { senderId, receiverId, text } = data;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      conversationId: conversation._id,
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    // ✅ Send to receiver in real-time
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
    }

    // ✅ Emit to sender as confirmation
    io.to(socket.id).emit("messageSaved", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(colors.bgCyan(`🚀 Server running on port ${PORT}`))
);
