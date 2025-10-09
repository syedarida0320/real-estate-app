const express = require("express");
const { getDashboardData } = require("../controllers/dashboard.controller");
const {authMiddleware}= require ("../middlewares/auth.middleware")

const router = express.Router();
router.use(authMiddleware);

router.get("/", getDashboardData);

module.exports = router;
