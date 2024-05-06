var express = require("express");
const memberController = require("../controller/memberController");
var router = express.Router();

router.route("/loginWithJWT").post(memberController.loginWithJWT);
router.route("/login").get(memberController.getLoginPage).post(memberController.login);
router.route("/logout").get(memberController.logout);
router.route("/signUp").post(memberController.signUp);
router.route("/verify").post(memberController.verifyCode);
module.exports = router;
