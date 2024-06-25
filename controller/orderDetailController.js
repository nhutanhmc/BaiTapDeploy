const OrderDetail = require('../model/orderDetailModel');
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const { calculateOrderTotal } = require('./orderUtils'); // Import từ orderUtils.js

class OrderDetailController {

    // Tạo chi tiết đơn hàng (Thêm sản phẩm vào đơn hàng)
    async createOrderDetail(req, res) {
        try {
            const { productID, quantity, orderID } = req.body;

            // Kiểm tra sản phẩm và đơn hàng tồn tại
            const product = await Product.findById(productID);
            const order = await Order.findById(orderID);
            if (!product || !order) {
                return res.status(404).json({ message: "Product or Order not found" });
            }

            // Tạo chi tiết đơn hàng
            const orderDetail = await OrderDetail.create({
                productID,
                quantity,
                orderID
            });

            // Cập nhật mảng orderDetails trong Order
            order.orderDetails.push(orderDetail._id);
            await order.save();

            // Cập nhật tổng giá của đơn hàng (tính toán lại)
            await calculateOrderTotal(orderID); // Sử dụng hàm từ orderUtils.js

            return res.status(201).json({ message: "OrderDetail created", orderDetail });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }

    // Đọc chi tiết đơn hàng (Lấy thông tin về sản phẩm trong đơn hàng)
    async getOrderDetail(req, res) {
        try {
            const orderDetail = await OrderDetail.findById(req.params.orderDetailId)
                .populate('productID'); // Populate thông tin sản phẩm
            if (!orderDetail) {
                return res.status(404).json({ message: "OrderDetail not found" });
            }
            return res.status(200).json({ orderDetail });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }

    // Lấy tất cả chi tiết đơn hàng
    async getAllOrderDetails(req, res) {
        try {
            const orderDetails = await OrderDetail.find().populate('productID');
            return res.status(200).json({ orderDetails });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }

    // Cập nhật chi tiết đơn hàng (Thay đổi số lượng sản phẩm trong đơn hàng)
    async updateOrderDetail(req, res) {
        try {
            const { quantity } = req.body;
            const orderDetail = await OrderDetail.findByIdAndUpdate(
                req.params.orderDetailId,
                { quantity },
                { new: true }
            );
            if (!orderDetail) {
                return res.status(404).json({ message: "OrderDetail not found" });
            }

            // Cập nhật tổng giá của đơn hàng (tính toán lại)
            await calculateOrderTotal(orderDetail.orderID);

            return res.status(200).json({ message: "OrderDetail updated", orderDetail });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }

    // Xóa chi tiết đơn hàng (Loại bỏ sản phẩm khỏi đơn hàng)
    async deleteOrderDetail(req, res) {
        try {
            const orderDetail = await OrderDetail.findByIdAndDelete(req.params.orderDetailId);
            if (!orderDetail) {
                return res.status(404).json({ message: "OrderDetail not found" });
            }

            // Cập nhật mảng orderDetails trong Order
            await Order.findByIdAndUpdate(orderDetail.orderID, { $pull: { orderDetails: orderDetail._id } });

            // Cập nhật tổng giá của đơn hàng (tính toán lại)
            await calculateOrderTotal(orderDetail.orderID);

            return res.status(200).json({ message: "OrderDetail deleted" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }
}

const orderDetailController = new OrderDetailController(); 

module.exports = { 
    createOrderDetail: orderDetailController.createOrderDetail.bind(orderDetailController), 
    getOrderDetail: orderDetailController.getOrderDetail.bind(orderDetailController),
    getAllOrderDetails: orderDetailController.getAllOrderDetails.bind(orderDetailController), // Thêm phương thức mới
    updateOrderDetail: orderDetailController.updateOrderDetail.bind(orderDetailController),
    deleteOrderDetail: orderDetailController.deleteOrderDetail.bind(orderDetailController),
};
