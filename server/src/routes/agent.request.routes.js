const express = require("express");
const {
  createAgentRequest,
  getAgentRequests,
  updateAgentRequestStatus,
} = require("../controllers/agent.request.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
const validateAgentRequest=require("../requests/agentRequest.validator");
const router = express.Router();

router.post("/create", validateAgentRequest, createAgentRequest); // user submits form
router.get("/all", authMiddleware, isAdmin, getAgentRequests); // admin panel
router.put(
  "/update-status/:id",
  authMiddleware,
  isAdmin,
  updateAgentRequestStatus
);

module.exports = router;
