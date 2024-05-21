const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductTypeSchema = new Schema({
    name: { type: String, required: true },
    size: { type: String },
    weight: { type: Number },
    description: { type: String },
    price: { type: Number },
    productType: { type: String },
    color: { type: String },
    materialName: { type: String, ref: 'Material' },
    gemstoneName: { type: String, ref: 'Gemstone' }
});

const ProductType = mongoose.model("ProductType", ProductTypeSchema);
module.exports = ProductType;
