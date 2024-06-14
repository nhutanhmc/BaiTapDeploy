var express = require("express");
const productTypeController = require("../controller/productTypeController");
const { authenticateToken, checkAdminRole } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get(productTypeController.getProductTypeList_Api).post(productTypeController.createProductType_Api);
router
  .route("/:id")
  .all(authenticateToken)
  .get(productTypeController.getProductTypeById_Api)
  .delete(productTypeController.deleteProductTypeById_Api)
  .put(productTypeController.updateProductTypeById_Api);

module.exports = router;
