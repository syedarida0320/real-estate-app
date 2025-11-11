const express = require("express");
const {
  createConversation,
  getConversation,
} = require("../controllers/conversation.controller");

const router = express.Router();

// POST: create a new conversation (user1, user2)
router.post("/", createConversation);

// GET: get all conversations for a specific user
router.get("/:userId/:receiverId", getConversation);

module.exports = router;

