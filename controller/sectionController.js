const Courses = require("../model/coursesModel");
const Sections = require("../model/sectionsModel");

function upperCaseFirstLetter(str) {
  return str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}

class sectionController {
  getSectionPage(req, res, next) {
    try {
      Courses.find({})
        .then((courses) => {
          Sections.find({})
            .populate("course")
            .sort({ updatedAt: -1 }) // descending : giảm dần
            .then((section) => {
              res.render("section/index", {
                sectionsData: section,
                coursesData: courses,
              });
            })
            .catch((err) => {
              req.flash("error", err.message || "Lỗi chưa xác định!");
              res.redirect("/errorPage");
            });
        })
        .catch((err) => {
          req.flash("error", err.message || "Lỗi chưa xác định!");
          res.redirect("/errorPage");
        });
    } catch (err) {
      req.flash("error", err.message || "Lỗi chưa xác định!");
      res.redirect("/errorPage");
    }
  }

  deleteSection(req, res, next) {
    try {
      Sections.findByIdAndDelete(req.params.id)
        .then((result) => {
          if (!result) {
            req.flash("success_msg", "Không có Sections nào được xóa!");
            return res.redirect("/sections");
          }
          req.flash("success_msg", "Xóa Sections thành công!");
          return res.redirect("/sections");
        })
        .catch((err) => {
          req.flash("error", err.message || "Lỗi chưa xác định!");
          res.redirect("/errorPage");
        });
    } catch (err) {
      req.flash("error", err.message || "Lỗi chưa xác định!");
      res.redirect("/errorPage");
    }
  }

  createSection(req, res, next) {
    console.log(123213123);
    let newData = {
      sectionName: req.body.sectionName?.trim(),
      sectionDescription: req.body.sectionDescription?.trim(),
      duration: Number(req.body.duration?.trim()),
      isMainTask: req.body.isMainTask ? true : false,
      course: req.body.course,
    };

    if (!newData.sectionName || !newData.sectionDescription || !newData.duration || !newData.course) {
      req.flash("error_msg", "Can not blank any fill!");
      return res.redirect(`/sections`);
    }
    newData.sectionName = upperCaseFirstLetter(newData.sectionName.toLowerCase());
    Courses.findById({ _id: newData.course })
      .then((data) => {
        if (!data) {
          req.flash("error_msg", "Course không tồn tại. Thêm mới thất bại!");
          res.redirect("/sections");
        }
        Sections.create(newData)
          .then((data) => {
            if (data) {
              req.flash("success_msg", "Thêm mới thành công!");
              return res.redirect("/sections");
            }
          })
          .catch((err) => {
            req.flash("error", err.message || "Lỗi chưa xác định!");
            res.redirect("/errorPage");
          });
      })
      .catch((err) => {
        req.flash("error", err.message || "Lỗi chưa xác định!");
        res.redirect("/errorPage");
      });
  }

  getSectionById(req, res, next) {
    try {
      Courses.find({})
        .then((courses) => {
          Sections.findById({ _id: req.params.id })
            .populate("course")
            .sort({ updatedAt: -1 }) // descending : giảm dần
            .then((data) => {
              if (!data) {
                req.flash("error_msg", "Section không tồn tại!");
                return res.redirect("/sections");
              }
              res.render("section/detail", {
                sectionDetail: data,
                coursesData: courses,
              });
            })
            .catch((err) => {
              req.flash("error", err.message || "Lỗi chưa xác định!");
              res.redirect("/errorPage");
            });
        })
        .catch((err) => {
          req.flash("error", err.message || "Lỗi chưa xác định!");
          res.redirect("/errorPage");
        });
    } catch (err) {
      req.flash("error", err.message || "Lỗi chưa xác định!");
      res.redirect("/errorPage");
    }
  }
  updateSection(req, res, next) {
    try {
      const sectionId = req.params.id;
      const updatedData = {
        sectionName: req.body.sectionName?.trim(),
        sectionDescription: req.body.sectionDescription?.trim(),
        duration: Number(req.body.duration?.trim()),
        isMainTask: req.body.isMainTask ? true : false,
        course: req.body.course,
      };
  
      if (!updatedData.sectionName || !updatedData.sectionDescription || !updatedData.duration || !updatedData.course) {
        req.flash("error_msg", "Không được để trống bất kỳ trường nào!");
        return res.redirect(`/sections/${sectionId}`);
      }
  
      updatedData.sectionName = upperCaseFirstLetter(updatedData.sectionName.toLowerCase());
  
      Courses.findById(updatedData.course)
        .then(course => {
          if (!course) {
            req.flash("error_msg", "Không tìm thấy khóa học. Cập nhật thất bại!");
            return res.redirect(`/sections/${sectionId}`);
          }
  
          Sections.findByIdAndUpdate(sectionId, updatedData, { new: true })
            .then(updatedSection => {
              if (!updatedSection) {
                req.flash("error_msg", "Không tìm thấy phần. Cập nhật thất bại!");
                return res.redirect(`/sections/${sectionId}`);
              }
  
              req.flash("success_msg", "Cập nhật thành công!");
              res.redirect(`/sections`);
            })
            .catch(err => {
              req.flash("error", err.message || "Lỗi chưa xác định!");
              res.redirect("/errorPage");
            });
        })
        .catch(err => {
          req.flash("error", err.message || "Lỗi chưa xác định!");
          res.redirect("/errorPage");
        });
    } catch (err) {
      req.flash("error", err.message || "Lỗi chưa xác định!");
      res.redirect("/errorPage");
    }
  }
}
module.exports = new sectionController();
