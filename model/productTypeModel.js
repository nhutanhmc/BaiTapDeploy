const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductTypeSchema = new Schema({
    name: { type: String, required: true },
    categoryID: { type: Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String }
});

const ProductType = mongoose.model("ProductType", ProductTypeSchema);
module.exports = ProductType;
