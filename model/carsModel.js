const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carsSchema = new Schema(
  {
    name: { type: String, require: true },
    type: { type: String, require: true },
    img: { type: String, require: true },
    cost: { type: Number, require: true },
    infor: { type: String, require: true }
  },
  { timestamps: true }
);

const Car = mongoose.model("Cars", carsSchema);
module.exports = Car;
