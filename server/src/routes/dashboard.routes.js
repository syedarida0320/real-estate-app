const express = require("express");
const { getDashboardData } = require("../controllers/dashboard.controller");
const {authMiddleware}= require ("../middlewares/auth.middleware");
const adminMiddleware=require("../middlewares/admin.middleware");

const router = express.Router();
router.use(authMiddleware, adminMiddleware);

router.get("/", getDashboardData);

module.exports = router;
