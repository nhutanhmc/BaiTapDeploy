const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    phone: { type: String },
    address: { type: String },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});
    
const Customer = mongoose.model("Customer", CustomerSchema)
module.exports = Customer;