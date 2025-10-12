// routes/agents.js
const express = require('express');
const router = express.Router();
const {getAllAgents, getAgentProperties, createAgent} = require('../controllers/agent.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware");
const upload=require("../middlewares/upload.middleware");

router.use(authMiddleware);

router.get('/', getAllAgents);
router.get('/:id/properties', getAgentProperties);
router.post("/", upload.single("profileImage"), createAgent)
//router.get('/:id', agentController.getAgentById);
//router.post('/' ,createAgent);
//router.put('/:id', agentController.updateAgent);

module.exports = router;