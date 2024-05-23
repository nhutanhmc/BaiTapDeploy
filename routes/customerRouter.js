var express = require("express");
const customerController = require("../controller/customerController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get(customerController.getCustomerList_Api).post(customerController.createCustomerById_Api);
router
  .route("/:id")
  .all(authenticateToken)
  .post(customerController.createCustomerById_Api)
  .get(customerController.getCustomerById_Api)
  .delete(customerController.deleteCustomerById_Api)
  .put(customerController.updateCustomerById_Api)

module.exports = router;
