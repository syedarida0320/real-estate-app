// routes/agents.js
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');

router.get('/', agentController.getAllAgents);
router.get('/:id/properties', agentController.getAgentProperties);
//router.get('/:id', agentController.getAgentById);
//router.post('/', agentController.createAgent);
//router.put('/:id', agentController.updateAgent);

module.exports = router;