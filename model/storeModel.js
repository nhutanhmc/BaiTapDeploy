const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    name: { type: String, required: true }, // Tên cửa hàng
    phone: { type: String, required: true },
    location: { type: String, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }] // Liên kết với các đơn hàng
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;
