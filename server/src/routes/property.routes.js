const express = require('express');
const router = express.Router();
const {getAllProperties, getPropertyById, createProperty, updateProperty, getUniqueCountries} = require('../controllers/property.controller');
const {propertyUpload}=require("../middlewares/property.middleware");
const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/countries', getUniqueCountries);
router.get('/', propertyUpload, getAllProperties);
router.get('/:id', propertyUpload ,getPropertyById);
router.post('/', propertyUpload , createProperty);
router.put('/:id', propertyUpload , updateProperty);

module.exports = router;