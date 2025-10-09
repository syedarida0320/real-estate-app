// routes/agents.js
const express = require('express');
const router = express.Router();
const {getAllAgents, getAgentProperties} = require('../controllers/agent.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/', getAllAgents);
router.get('/:id/properties', getAgentProperties);
//router.get('/:id', agentController.getAgentById);
//router.post('/', agentController.createAgent);
//router.put('/:id', agentController.updateAgent);

module.exports = router;