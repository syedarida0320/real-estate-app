const express = require('express');
const router = express.Router();
const { getAllProperties, getPropertyById, createProperty, updateProperty, getUniqueCountries, getPropertiesByCity, getPropertyBySlug } = require('../controllers/property.controller');
const { propertyUpload, handleMulterError } = require("../middlewares/property.middleware");
const { authMiddleware } = require("../middlewares/auth.middleware")
const {createPropertySchema, updatePropertySchema,validate}=require("../requests/property.validator");

router.get('/public/:slug', getPropertyBySlug);
router.get('/all', getAllProperties);
router.get("/cities/list", getPropertiesByCity)
router.get('/countriesProperty', getUniqueCountries);

router.use(authMiddleware);
router.get("/", getAllProperties)
router.get('/countries', getUniqueCountries);
router.get('/:id', getPropertyById);

router.post('/', propertyUpload, handleMulterError,validate(createPropertySchema), createProperty);
router.put('/:id', propertyUpload, handleMulterError,validate(updatePropertySchema), updateProperty);



module.exports = router;