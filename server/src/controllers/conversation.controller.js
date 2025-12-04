// const Conversation = require("../models/Conversation");

// // GET /api/conversations/:userId
// const getUserConversations = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Only fetch conversations that have a lastMessage
//     const conversations = await Conversation.find({
//       participants: userId,
//       lastMessage: { $ne: null }, // ensures conversation has at least one message
//     })
//       .populate("participants", "firstName lastName email profileImagePath")
//       .populate("lastMessage")
//       .sort({ updatedAt: -1 });

//     const formatted = conversations.map((c) => {
//       const otherUser = c.participants.find((p) => p._id.toString() !== userId);
//       return {
//         _id: c._id,
//         otherUser,
//         lastMessage: c.lastMessage,
//       };
//     });

//     res.json({ success: true, data: formatted });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// module.exports = {
//   getUserConversations,
// };

