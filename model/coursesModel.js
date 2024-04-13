const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coursesSchema = new Schema(
  {
    courseName: { type: String, require: true },
    courseDescription: { type: String, require: true },
  },
  { timestamps: true }
);

const Courses = mongoose.model("Courses", coursesSchema);
module.exports = Courses;
