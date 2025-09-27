const express = require('express');
const router = express.Router();
const {getUsers, createUser, getUserById, updateUser} = require('../controllers/user.controller');
const auth= require ("../middlewares/middleware")
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put("/:id",auth, updateUser)

module.exports = router;
