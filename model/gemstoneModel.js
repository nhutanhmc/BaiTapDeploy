const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GemstoneSchema = new Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    size: { type: String, required: true }
  },
  { timestamps: true }
);

const Gemstone = mongoose.model("Gemstone", GemstoneSchema);
module.exports = Gemstone;
