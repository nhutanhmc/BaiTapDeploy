const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  size: { type: String },
  weight: { type: Number },
  description: { type: String },
  price: { type: Number },
  productType: { type: String },
  color: { type: String },
  materialID: { type: Schema.Types.ObjectId, ref: 'Material' },
  gemstoneID: { type: Schema.Types.ObjectId, ref: 'Gemstone' },
  productTypeID: { type: Schema.Types.ObjectId, ref: 'ProductType' },
  imageLink: { type: String, required: true }
});

const User = mongoose.model('User', ProductSchema);

module.exports = User;
