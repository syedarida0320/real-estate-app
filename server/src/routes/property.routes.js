const express = require('express');
const router = express.Router();
const {getAllProperties, getPropertyById, createProperty, updateProperty} = require('../controllers/property.controller');

const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/',  getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);
router.put('/:id', updateProperty);

module.exports = router;

//router.get('/search', propertyController.searchProperties);
//router.delete('/:id', auth, propertyController.deleteProperty);