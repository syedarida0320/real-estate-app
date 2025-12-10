const express = require("express");
const router = express.Router();
const {
  getAllAgents,
  getAgentProperties,
  createAgent,
  getAgentById,
} = require("../controllers/agent.controller");
const validate=require("../middlewares/validate.request");
const {addAgentSchema}=require("../requests/agent.validator");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  upload,
  handleMulterError,
} = require("../middlewares/upload.middleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
router.use(authMiddleware);

// TODO: Routes are not protected. Anyone can access agent data. Please secure these routes.

router.get("/", isAdmin, getAllAgents);
router.get("/:id/properties", isAdmin, getAgentProperties);
router.post(
  "/",
  upload.single("profileImage"),
  handleMulterError,
  validate(addAgentSchema),
  isAdmin,
  createAgent
);
router.get("/:id", isAdmin, getAgentById);

module.exports = router;
