const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { response } = require("../utils/response");
//const User = require("../models/User");
//const Agent = require("../models/Agent");

// Get single conversation by ID
const getConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // Check if user is a participant
    const conv = await Conversation.findById(conversationId);
    if (!conv) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    if (!conv.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You are not a participant of this conversation.",
      });
    }

    const messages = await Message.find({ conversationId })
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
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiver] },
    });

    if (!conversation && text?.trim()) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiver],
      });
    }

    const message = new Message({
      sender: req.user.id,
      receiver,
      text,
      messageType,
      conversationId: conversation._id,
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

const sendMessageSocket = async (data) => {
  const { senderId, receiver, text, messageType = "text" } = data;
  if (!senderId || !receiver || !text) throw new Error("Missing fields");

  // find/create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiver] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiver],
    });
  }

  const message = await new Message({
    sender: senderId,
    receiver,
    text,
    messageType,
    conversationId: conversation._id,
  }).save();

  conversation.lastMessage = message._id;
  conversation.updatedAt = new Date();
  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name email avatar")
    .populate("receiver", "name email avatar");

  return populatedMessage;
};

const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // if (req.user.id.toString() !== userId.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied. You can only view your own conversations.",
    //   });
    // }

    const conversations = await Conversation.find({
      participants: userId,
      lastMessage: { $ne: null },
    })
      .populate("participants", "firstName lastName email profileImagePath")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const formatted = conversations.map((c) => {
      const otherUser = c.participants.find((p) => p._id.toString() !== userId);

      return {
        _id: c._id,
        otherUser,
        lastMessage: c.lastMessage,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getConversation,
  sendMessage,
  sendMessageSocket,
  getUserConversations,
};
