const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  cash: { type: Boolean, default: false },
  bank: { type: String, required: true },
  transactionId: { type: String, required: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming there is a User model
  vnp_ResponseCode: { type: String }, // VNPAY response code
  vnp_ResponseMessage: { type: String }, // VNPAY response message
  vnp_TransactionNo: { type: String }, // VNPAY transaction number
  vnp_BankCode: { type: String } // VNPAY bank code
}, { timestamps: true });

PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
