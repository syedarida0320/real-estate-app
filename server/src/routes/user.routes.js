const express = require('express');
const router = express.Router();
const {getUsers,getProfileImage,createUser, getUserById, updateUser, getUserMessages} = require('../controllers/user.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware")
const upload=require("../middlewares/upload")

router.get('/',authMiddleware, getUsers);
router.post("/",authMiddleware, createUser);
router.get('/messages',authMiddleware, getUserMessages);

router.get("/:id/profile-image",getProfileImage);
router.get('/:id',authMiddleware, getUserById);
router.put("/:id",upload.single("profileImage"),authMiddleware, updateUser);

module.exports = router;
