const { text } = require("express");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true },
  messageType: {
    type: String,
    enum: ["text", "image", "video"],
    default: "text",
  },
  isRead: { type: Boolean, default: false },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
