const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { response } = require("../utils/response"); // assuming this is your helper

// Get all conversations for logged-in user
const getConversations = async (req, res) => {
  try {
    // find all conversations where user is participant
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "name email avatar") // avatar optional
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name email avatar" }
      })
      .sort({ updatedAt: -1 });

    // compute unread counts per conversation (optional efficient version could use aggregation)
    const convsWithCounts = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          receiver: req.user.id,
          isRead: false
        });

        return {
          _id: conv._id,
          participants: conv.participants,
          lastMessage: conv.lastMessage,
          property: conv.property,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          unreadCount
        };
      })
    );

    response.ok(res, "Conversations fetched successfully", convsWithCounts);
  } catch (error) {
    console.error(error);
    response.serverError(res, "Error fetching conversations");
  }
};

// Get single conversation by ID
const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: 1 }); // oldest to newest

    response.ok(res, "Conversation fetched successfully", messages);
  } catch (error) {
    console.error(error);
    response.serverError(res, "Error fetching conversation");
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, receiver, messageType = "text" } = req.body;

    // if no conversation exists, create new
    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.create({
          participants: [req.user.id, receiver]
        });

    const message = new Message({
      sender: req.user.id,
      receiver,
      text,
      messageType,
      conversationId: conversation._id
    });

    await message.save();

    // update last message in conversation
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // populate message sender for response
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email avatar"
    );

    response.created(res, "Message sent successfully", populatedMessage);
  } catch (error) {
    console.error(error);
    response.serverError(res, "Error sending message");
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    response.ok(res, "Message marked as read", message);
  } catch (error) {
    console.error(error);
    response.serverError(res, "Error marking message as read");
  }
};

module.exports = {
  getConversations,
  getConversation,
  sendMessage,
  markAsRead
};