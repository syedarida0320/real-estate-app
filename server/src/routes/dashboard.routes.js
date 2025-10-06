const express = require("express");
const { getDashboardData } = require("../controllers/dashboard.controller");

const router = express.Router();

// GET Dashboard data
router.get("/", getDashboardData);

module.exports = router;
