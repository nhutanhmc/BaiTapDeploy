const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MaterialSchema = new Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    size: { type: String, required: true }
  },
  { timestamps: true }
);

const Material = mongoose.model("Material", MaterialSchema);
module.exports = Material;
