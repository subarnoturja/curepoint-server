const express = require('express');
const { updateDoctor, deleteDoctor, getAllDoctor, getSingleDoctor } = require('../Controllers/doctorController')

const router = express.Router()
router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctor)
router.put('/:id', updateDoctor)
router.delete('/:id', deleteDoctor)

module.exports = router;