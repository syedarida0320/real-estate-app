const express = require('express');
const router = express.Router();
const {getConversation, sendMessage, getUserConversations} = require('../controllers/message.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware")

router.use(authMiddleware);

router.get("/conversations", getUserConversations); // TODO: Not secure, anyone can get conversations of any user by providing userId.
router.get('/conversation/:id', getConversation);
router.post('/send' , sendMessage);

module.exports = router;
