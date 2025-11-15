const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { response } = require("../utils/response"); 


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
          participants: [req.user.id, receiver],
        });

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

module.exports = {
  getConversation,
  sendMessage,
  sendMessageSocket,
};
