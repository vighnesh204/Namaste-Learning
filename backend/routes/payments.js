const express = require('express');
const router = express.Router();

const { capturePayment, verifyPayment, captureMockPayment } = require('../controllers/payments');
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth');

router.post('/capturePayment', auth, isStudent, capturePayment);
router.post('/captureMockPayment', auth, isStudent, captureMockPayment);
router.post('/verifyPayment', auth, isStudent, verifyPayment);

module.exports = router
