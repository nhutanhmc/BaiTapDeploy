var express = require("express");
const materialController = require("../controller/materialController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get(materialController.getMaterialsList_Api).post(materialController.createMaterial_Api);
router
  .route("/:id")
  .all(authenticateToken)
  .get(materialController.getMaterialById_Api)
  .delete(materialController.deleteMaterialById_Api)
  .put(materialController.updateMaterialById_Api);

module.exports = router;
