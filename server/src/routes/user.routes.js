const express = require('express');
const router = express.Router();
const {getUsers,getProfileImage, getUserById, updateUser, getUserMessages} = require('../controllers/user.controller');
const {authMiddleware}= require ("../middlewares/auth.middleware");
const upload=require("../middlewares/upload");
const validate=require("../middlewares/validate.request");
const {updateProfileSchema}=require("../requests/user.validator");


router.get("/:id/profile-image",getProfileImage);
// TODO: If one middleware is common for all routes, use router.use(middleware) instead of adding it to each route.
router.use(authMiddleware);

router.get('/', getUsers);
router.get('/messages', getUserMessages);
router.get('/:id', getUserById);

router.put("/:id",upload.single("profileImage"), validate(updateProfileSchema), updateUser);

module.exports = router;
