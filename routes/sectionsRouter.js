var express = require("express");
const sectionController = require("../controller/sectionController");
const { ensureAuthenticated } = require("../config/auth");
var router = express.Router();

router.route("/")
  .all(ensureAuthenticated) // Áp dụng ensureAuthenticated cho tất cả các method (GET, POST)
  .get(sectionController.getSectionPage)
  .post(sectionController.createSection);

router.route("/:id")
  .all(ensureAuthenticated) // Áp dụng ensureAuthenticated cho tất cả các method (GET, DELETE)
  .get(sectionController.getSectionById)
  .delete(sectionController.deleteSection)
  .put(sectionController.updateSection);
module.exports = router;
