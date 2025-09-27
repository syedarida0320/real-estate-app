const express = require('express');
const router = express.Router();
const {getAllProperties, getPropertyById} = require('../controllers/property.controller');
//const auth = require('../middleware/auth');

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
//router.get('/search', propertyController.searchProperties);
//router.post('/', auth, propertyController.createProperty);
//router.put('/:id', auth, propertyController.updateProperty);
//router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;