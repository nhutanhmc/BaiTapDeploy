const Payment = require('../model/paymentModel');

class PaymentController {
    // Tạo phương thức thanh toán mới
    async createPayment(req, res) {
        try {
            const { name } = req.body;
            const payment = await Payment.create({ name });
            res.status(201).json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Lấy danh sách phương thức thanh toán
    async getAllPayments(req, res) {
        try {
            const payments = await Payment.find();
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Lấy thông tin phương thức thanh toán theo ID
    async getPaymentById(req, res) {
        try {
            const payment = await Payment.findById(req.params.id);
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' });
            }
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Cập nhật thông tin phương thức thanh toán
    async updatePayment(req, res) {
        try {
            const { name } = req.body;
            const payment = await Payment.findByIdAndUpdate(
                req.params.id,
                { name },
                { new: true }
            );
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' });
            }
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Xóa phương thức thanh toán
    async deletePayment(req, res) {
        try {
            const payment = await Payment.findByIdAndDelete(req.params.id);
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found' });
            }
            res.status(200).json({ message: 'Payment deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new PaymentController();
