const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const PaymentSchema = new Schema({
    cash: { type: Boolean },
    bank: { type: String }
});

    
const Payment = mongoose.model("Payment", PaymentSchema)
module.exports = Payment;