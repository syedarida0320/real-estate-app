const express = require("express");
const router = express.Router();
const {
  getAllAgents,
  getAgentProperties,
  createAgent,
  getAgentById,
} = require("../controllers/agent.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  upload,
  handleMulterError,
} = require("../middlewares/upload.middleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
router.use(authMiddleware);

router.get("/", isAdmin, getAllAgents);
router.get("/:id/properties", isAdmin, getAgentProperties);
router.post(
  "/",
  upload.single("profileImage"),
  handleMulterError,
  isAdmin,
  createAgent
);
router.get("/:id", isAdmin, getAgentById);

module.exports = router;
