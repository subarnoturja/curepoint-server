const express = require('express');
const { updateDoctor, deleteDoctor, getAllDoctor, getSingleDoctor, getDoctorProfile } = require('../Controllers/doctorController')
const { authenticate, restrict } = require("../auth/verifyToken");
const reviewRouter = require('../Routes/review')

const router = express.Router()

// Nested route
router.use('/:doctorId/reviews', reviewRouter);

router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctor)
router.put('/:id', authenticate, restrict(["doctor"]), updateDoctor)
router.delete('/:id', authenticate, restrict(["doctor"]), deleteDoctor)
router.delete('/profile/me', authenticate, restrict(["doctor"]), getDoctorProfile)

module.exports = router;