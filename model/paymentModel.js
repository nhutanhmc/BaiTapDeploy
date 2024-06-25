const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ['cash', 'bank', 'credit card'] // Các phương thức thanh toán khả dụng
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
