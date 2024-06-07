const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  username: { type: String, require: true },
  password: { type: String, require: true },
  role: { type: String, require: true },
  googleId: String // Thêm trường để lưu Google ID
}, { timestamps: true });

const Staff = mongoose.model("Staff", StaffSchema);
module.exports = Staff;
