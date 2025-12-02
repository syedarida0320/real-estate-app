const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/email");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {response}=require("../utils/response");

// POST /api/send-email
router.post("/send-email",authMiddleware, async (req, res) => {
  const { to, subject, message } = req.body;

   // Validation
  if (!to || !subject || !message) {
    return response.badRequest(res, "to, subject, and message fields are required", {
      fields: ["to", "subject", "message"]
    });
  }
try {
    const info = await sendEmail(to, subject, message);

    return response.ok(res, "Email sent successfully", {
      messageId: info.messageId
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    return response.serverError(res, "Failed to send email", {
      error: [err.message]
    });
  }
});

module.exports = router;
