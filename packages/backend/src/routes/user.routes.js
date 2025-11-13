const express = require('express');
const router = express.Router();
const {getUsers,getProfileImage,createUser, getUserById, updateUser} = require('../controllers/user.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware")
const upload=require("../middlewares/upload")

// Protect all routes
router.use(authMiddleware);

router.get('/', getUsers);
router.post("/", createUser);
router.get('/:id', getUserById);
router.put("/:id",upload.single("profileImage"), updateUser);
router.get("/:id/profile-image",getProfileImage);

module.exports = router;
