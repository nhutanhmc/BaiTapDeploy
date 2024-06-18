const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    imageLink: { type: String, required: true }
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
