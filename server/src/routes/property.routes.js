const express = require('express');
const router = express.Router();
const {getAllProperties, getPropertyById, createProperty, updateProperty} = require('../controllers/property.controller');
const {propertyUpload}=require("../middlewares/property.middleware");
const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/', propertyUpload, getAllProperties);
router.get('/:id', propertyUpload ,getPropertyById);
router.post('/', propertyUpload , createProperty);
router.put('/:id', propertyUpload , updateProperty);

module.exports = router;

//router.get('/search', propertyController.searchProperties);
//router.delete('/:id', auth, propertyController.deleteProperty);