var express = require("express");
const carsController = require("../controller/carsController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").get(carsController.getCarsList_Api).post(carsController.createCar_Api);
router
  .route("/:id")
//   .all(authenticateToken)
  .get(carsController.getCarById_Api)
  .delete(carsController.deleteCarById_Api)
  .put(carsController.updateCarById_Api);

module.exports = router;
