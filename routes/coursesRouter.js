var express = require("express");
const coursesController = require("../controller/coursesController");
const { authenticateToken } = require("../config/authWithJWT");
var router = express.Router();

router.route("/").all(authenticateToken).get(coursesController.getCoursesList_Api).post(coursesController.createCourses_Api);
router
  .route("/:id")
  .all(authenticateToken)
  .get(coursesController.getCoursesById_Api)
  .delete(coursesController.deleteCoursesById_Api)
  .put(coursesController.updateCoursesById_Api);

module.exports = router;
