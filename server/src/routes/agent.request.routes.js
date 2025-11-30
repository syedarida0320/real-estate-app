const express = require("express");
const {
  createAgentRequest,
  getAgentRequests,
  updateAgentRequestStatus,
} = require("../controllers/agent.request.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/create", createAgentRequest); // user submits form
router.get("/all", authMiddleware, isAdmin, getAgentRequests); // admin panel
router.put(
  "/update-status/:id",
  authMiddleware,
  isAdmin,
  updateAgentRequestStatus
); // admin approves/rejects

module.exports = router;
