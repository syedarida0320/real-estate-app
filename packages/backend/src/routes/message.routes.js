const express = require('express');
const router = express.Router();
const {getConversations, getConversation, sendMessage, markAsRead} = require('../controllers/message.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/conversations', getConversations);
router.get('/conversation/:id', getConversation);
router.post('/send' , sendMessage);
router.put('/read/:id', markAsRead);

module.exports = router;
