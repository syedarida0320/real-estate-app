const express = require('express');
const router = express.Router();
const {loginUser, registerUser,verifyEmail,setNewPassword} = require('../controllers/auth.controller');
const validate= require ("../middlewares/validate.request");
const {registerSchema}= require ("../requests/register.schema");
const {loginSchema}= require ("../requests/login.schema");


router.post('/login',validate(loginSchema), loginUser);
router.post('/register',validate(registerSchema), registerUser);
router.get("/verify/email", verifyEmail);
router.post("/set-password", setNewPassword);

module.exports = router;