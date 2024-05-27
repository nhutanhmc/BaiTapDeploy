var express = require("express");
const categoryController = require("../controller/categoryController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get(categoryController.getCategoryList_Api).post(categoryController.createCategory_Api);
router
  .route("/:id")
  .all(authenticateToken)
  .get(categoryController.getCategoryById_Api)
  .delete(categoryController.deleteCategoryById_Api)
  .put(categoryController.updateCategoryById_Api);

module.exports = router;
