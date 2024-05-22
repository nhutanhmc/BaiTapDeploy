var express = require("express");
const productController = require("../controller/productController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get().post();
router
  .route("/:id")
  .all(authenticateToken)
  .post(productController.addProduct);

module.exports = router;
