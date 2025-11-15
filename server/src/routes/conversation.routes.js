const express = require("express");
const router = express.Router();
const {
  createConversation
} = require("../controllers/conversation.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
router.use(authMiddleware);

router.post("/", createConversation);

module.exports = router;
