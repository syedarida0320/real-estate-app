const express = require('express');
const router = express.Router();
const {getConversation, sendMessage} = require('../controllers/message.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/conversation/:id', getConversation);
router.post('/send' , sendMessage);

module.exports = router;
