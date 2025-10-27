const express=require('express');
const { getReverseGeocode, searchLocation }=require("../controllers/map.controller");

const router = express.Router();

router.get("/reverse", getReverseGeocode);
router.get("/search", searchLocation);

module.exports= router;
