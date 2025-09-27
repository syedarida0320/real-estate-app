// controllers/message.controller.js
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { response } = require("../utils/response");

// 📌 Get all conversations for logged-in user
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "name email")
      .populate("lastMessage");
    response.ok(res, "Conversations fetched successfully", conversations);
  } catch (error) {
    response.serverError(res, "Error fetching conversations");
  }
};

// 📌 Get single conversation by ID
const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id })
      .populate("sender", "name email")
      .sort({ createdAt: 1 }); // oldest to newest
    response.ok(res, "Conversation fetched successfully", messages);
  } catch (error) {
    response.serverError(res, "Error fetching conversation");
  }
};

// 📌 Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, receiverId } = req.body;

    // if no conversation exists, create new
    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.create({
          participants: [req.user.id, receiverId],
        });

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
      conversationId: conversation._id,
    });

    await message.save();

    // update last message in conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    response.created(res, "Message sent successfully", message);
  } catch (error) {
    response.serverError(res, "Error sending message");
  }
};
//  Mark message as read
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
     response.ok(res, "Message marked as read", message);
  } catch (error) {
    response.serverError(res, "Error marking message as read");
  }
};

module.exports = {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead,
}
