const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    size: { type: String },
    weight: { type: Number },
    description: { type: String },
    price: { type: Number },
    productType: { type: String },
    color: { type: String },
    materialName: { type: String, ref: 'Material' },
    gemstoneName: { type: String, ref: 'Gemstone' },
    productTypes: { type: String, ref: 'ProductType' },
    imageLink: { type: String, required: true }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
