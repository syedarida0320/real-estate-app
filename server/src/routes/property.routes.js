const express = require('express');
const router = express.Router();
const {getAllProperties, getPropertyById, createProperty, updateProperty, getUniqueCountries} = require('../controllers/property.controller');
const {propertyUpload, handleMulterError}=require("../middlewares/property.middleware");
const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/countries', getUniqueCountries);
router.get('/', getAllProperties);
router.get('/:id' ,getPropertyById);
router.post('/', propertyUpload ,handleMulterError, createProperty);
router.put('/:id', propertyUpload ,handleMulterError, updateProperty);

module.exports = router;