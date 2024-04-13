const Courses = require("../model/coursesModel");

class coursesController {
  getCoursesList_Api(req, res, next) {
    try {
      return new Promise((resolve, reject) => {
        Courses.find({}).then((courses) => {
          if (courses.length > 0) {
            return resolve(res.status(200).json(courses));
          } else {
            return resolve(res.status(200).json("Không có courses nào!"));
          }
        });
      }).catch((err) => {
        return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
      });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }

  getCoursesById_Api(req, res, next) {
    try {
      Courses.findById({ _id: req.params.id })
        .then((course) => {
          if (course) {
            return res.status(200).json(course);
          } else {
            return res.json("Course không tồn tại!");
          }
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }

  createCourses_Api(req, res, next) {
    try {
      let newcourseName = req.body.courseName?.trim();
      let newcourseDescription = req.body.courseDescription?.trim();
      if (!newcourseName || newcourseName === "") {
        return res.json("Vui lòng nhập coursesName để tạo mới");
      }
      if (!newcourseDescription || newcourseDescription === "") {
        return res.json("Vui lòng nhập courseDescription để tạo mới");
      }
      Courses.findOne({ courseName: newcourseName })
        .then((courses) => {
          if (courses) {
            return res.json("courses này đã tồn tại. Vui lòng nhập coursesName khác!");
          }
          Courses.create({ courseName: newcourseName, courseDescription: newcourseDescription })
            .then((result) => {
              return res.status(201).json(result);
            })
            .catch((err) => {
              return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
            });
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }

  deleteCoursesById_Api(req, res, next) {
    try {
      Courses.findById({ _id: req.params.id })
        .then((courses) => {
          if (!courses) {
            return res.json("Courses không tồn tại!");
          }
          Courses.deleteOne({ _id: req.params.id })
            .then((result) => {
              if (result.deletedCount === 1) {
                return res.status(200).json("Xóa dữ liệu thành công!");
              } else {
                return res.json("Không có dữ liệu nào được xóa!");
              }
            })
            .catch((err) => {
              return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
            });
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }
  updateCoursesById_Api(req, res, next) {
    try {
      let updateCourseName = req.body.courseName?.trim();
      let updateCourseDescription = req.body.courseDescription?.trim();
      if (!updateCourseName) {
        return res.json("Vui lòng không để trống coursesName!");
      }
      if (!updateCourseDescription) {
        return res.json("Vui lòng không để trống courseDescription!");
      }
      Courses.findByIdAndUpdate(req.params.id, { courseName: updateCourseName, courseDescription: updateCourseDescription }, { new: true })
        .then((course) => {
          if (!course) {
            return res.json("Course không tồn tại!");
          }
          return res.json(course);
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }
}
module.exports = new coursesController();
