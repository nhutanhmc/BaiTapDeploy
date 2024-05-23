var express = require("express");
const paymentController = require("../controller/paymentController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/payment")
  .all(authenticateToken)
  .get(paymentController.getPaymentList_Api)
  .post(paymentController.createPaymentById_Api);

router.route("/payment/:id")
  .all(authenticateToken)
  .get(paymentController.getPaymentById_Api);

// Additional payment-related routes
router.route("/order/create_payment_url")
  .all(authenticateToken)
  .post(paymentController.createPaymentById_Api);

router.route("/order/querydr")
  .all(authenticateToken)
  .get(paymentController.queryPaymentResult_Api);

module.exports = router;
