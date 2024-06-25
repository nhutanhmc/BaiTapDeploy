const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const { authenticateToken } = require('../config/authWithJWT');

router.use(authenticateToken);

router.route('/')
    .get(paymentController.getAllPayments)
    .post(paymentController.createPayment);

router.route('/:id')
    .get(paymentController.getPaymentById)
    .put(paymentController.updatePayment)
    .delete(paymentController.deletePayment);

module.exports = router;
