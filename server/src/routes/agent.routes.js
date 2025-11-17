// routes/agents.js
const express = require('express');
const router = express.Router();
const {getAllAgents, getAgentProperties, createAgent, getAgentById, getAllAgentsForMessaging} = require('../controllers/agent.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware");
const {upload, handleMulterError}=require("../middlewares/upload.middleware");

router.use(authMiddleware);

router.get('/', getAllAgents);
router.get('/:id/properties', getAgentProperties);
router.post("/", upload.single("profileImage"),handleMulterError, createAgent)
router.get('/:id', getAgentById);

module.exports = router;