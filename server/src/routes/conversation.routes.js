const express = require("express");
const router = express.Router();
const {
  getUserConversations
} = require("../controllers/conversation.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
router.use(authMiddleware);

router.post("/", getUserConversations);

module.exports = router;
