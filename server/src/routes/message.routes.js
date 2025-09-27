const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

router.get('/conversations',auth, messageController.getConversations);
router.get('/conversation/:id',auth, messageController.getConversation);
router.post('/send',auth, messageController.sendMessage);
router.put('/read/:id',auth, messageController.markAsRead);

module.exports = router;
