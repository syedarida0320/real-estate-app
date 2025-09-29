const express = require('express');
const router = express.Router();
const {loginUser, registerUser} = require('../controllers/auth.controller');
const validate= require ("../middlewares/validate.request");
const {registerSchema}= require ("../requests/register.schema");
const {loginSchema}= require ("../requests/login.schema");


router.post('/login',validate(loginSchema), loginUser);
router.post('/register',validate(registerSchema), registerUser);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

module.exports = router;