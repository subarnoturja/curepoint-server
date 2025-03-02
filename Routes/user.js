const express = require('express');
const { updateUser, deleteUser, getAllUser, getSingleUser } = require('../Controllers/userController')

const router = express.Router()
router.get('/:id', getSingleUser)
router.get('/', getAllUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router;