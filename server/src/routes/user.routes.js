const express = require('express');
const router = express.Router();
const {getUsers,getProfileImage,createUser, getUserById, updateUser, getUserMessages} = require('../controllers/user.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware")
const upload=require("../middlewares/upload")

// Protect all routes
router.use(authMiddleware);

router.get('/', getUsers);
router.post("/", createUser);
router.get('/messages', getUserMessages);

router.get("/:id/profile-image",getProfileImage);
router.get('/:id', getUserById);
router.put("/:id",upload.single("profileImage"), updateUser);

module.exports = router;
