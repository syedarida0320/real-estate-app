const express = require('express');
const router = express.Router();
const {getAllProperties, getPropertyById, createProperty} = require('../controllers/property.controller');

const {authMiddleware}= require ("../middlewares/auth.middleware")
router.use(authMiddleware);

router.get('/',  getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', createProperty);
// router.post('/', createProperty);
//router.get('/search', propertyController.searchProperties);
//router.put('/:id', auth, propertyController.updateProperty);
//router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;