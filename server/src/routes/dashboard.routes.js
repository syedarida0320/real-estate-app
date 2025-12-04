const express = require("express");
const { getDashboardData } = require("../controllers/dashboard.controller");
const {authMiddleware}= require ("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

const router = express.Router();
router.use(authMiddleware, isAdmin);

router.get("/", getDashboardData);

module.exports = router;
