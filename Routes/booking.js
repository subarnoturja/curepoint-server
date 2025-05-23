const express = require ('express');
const { authenticate } = require ("../auth/verifyToken");
const { getCheckoutSession } = require ('../Controllers/bookingController')

const router = express.Router();

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession)

module.exports = router;