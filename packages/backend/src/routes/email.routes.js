// routes/email.routes.js
const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/email");

// POST /api/send-email
router.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "to, subject, and message are required" });
  }

  try {
    const info = await sendEmail(to, subject, message);
    res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
