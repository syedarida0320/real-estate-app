const express = require('express');
const router = express.Router();
const {getAllProperties, getPropertyById, createProperty, updateProperty, getUniqueCountries, getPropertiesByCity, getPropertyBySlug} = require('../controllers/property.controller');
const {propertyUpload, handleMulterError}=require("../middlewares/property.middleware");
const {authMiddleware}= require ("../middlewares/auth.middleware")


router.get('/public/:slug', getPropertyBySlug);  
 router.get('/all', getAllProperties);
router.get("/cities/list", getPropertiesByCity)
router.get('/countriesProperty', getUniqueCountries);

router.get("/",authMiddleware, getAllProperties)
router.get('/countries',  authMiddleware, getUniqueCountries);
router.get('/:id' , authMiddleware, getPropertyById);

router.post('/', authMiddleware, propertyUpload ,handleMulterError, createProperty);
router.put('/:id', authMiddleware, propertyUpload ,handleMulterError, updateProperty);



module.exports = router;