var express = require("express");
const gemstoneController = require("../controller/gemstoneController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get(gemstoneController.getGemstonesList_Api).post(gemstoneController.createGemstone_Api);
router
  .route("/:id")
  .all(authenticateToken)
  .get(gemstoneController.getGemstoneById_Api)
  .delete(gemstoneController.deleteGemstoneById_Api)
  .put(gemstoneController.updateGemstoneById_Api);

module.exports = router;
