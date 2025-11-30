const express = require("express");
const {
  createAgentRequest,
  getAgentRequests,
  updateAgentRequestStatus,
} = require("../controllers/agent.request.controller");
<<<<<<< HEAD
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
=======

const router = express.Router();

router.post("/create", createAgentRequest); // user submits form
router.get("/all", getAgentRequests); // admin panel
router.put("/update-status/:id", updateAgentRequestStatus); // admin approves/rejects
>>>>>>> 1f76e056cbffbb0c3871c1e718313fd9d67f66b0

module.exports = router;
