const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OderSchema = new Schema(
    {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
    }
  
);

const Oder = mongoose.model("Oder", OderSchema );
module.exports = Oder;
