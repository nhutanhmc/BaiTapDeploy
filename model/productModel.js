const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    weight: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    materialID: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    gemstoneID: { type: Schema.Types.ObjectId, ref: 'Gemstone', required: true },
    productTypeID: { type: Schema.Types.ObjectId, ref: 'ProductType', required: true },
    imageIDs: [{ type: Schema.Types.ObjectId, ref: 'Image' }]
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
