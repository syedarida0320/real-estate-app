const express = require("express");
const {
  createAgentRequest,
  getAgentRequests,
  updateAgentRequestStatus,
} = require("../controllers/agent.request.controller");

const router = express.Router();

router.post("/create", createAgentRequest); // user submits form
router.get("/all", getAgentRequests); // admin panel
router.put("/update-status/:id", updateAgentRequestStatus); // admin approves/rejects

module.exports = router;
