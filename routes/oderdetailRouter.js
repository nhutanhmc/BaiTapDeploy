var express = require("express");
const oderController = require("../controller/oderController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get().post();
router
  .route("/:id")
  .all(authenticateToken)
  .get(oderController)
  .delete(oderController)
  .put(oderController);

module.exports = router;
