const express = require('express');
const { updateUser, deleteUser, getAllUser, getSingleUser, getUserProfile, getMyAppointments } = require('../Controllers/userController')
const { authenticate, restrict } = require("../auth/verifyToken");

const router = express.Router()

router.get('/profile/me', authenticate, restrict(["patient", "admin", "doctor"]), getUserProfile)
router.get('/appointments/my-appointments', authenticate, restrict(["patient"]), getMyAppointments)

router.get('/:id', authenticate, restrict(["patient"]), getSingleUser)
router.get('/', authenticate, restrict(["admin"]), getAllUser)
router.put('/:id', authenticate, restrict(["patient"]), updateUser)
router.delete('/:id', authenticate, restrict(["patient"]), deleteUser)

module.exports = router;