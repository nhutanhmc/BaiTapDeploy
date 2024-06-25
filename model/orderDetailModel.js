const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
});

const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);
module.exports = OrderDetail;
