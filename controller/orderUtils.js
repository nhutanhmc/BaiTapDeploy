// orderUtils.js
const Order = require('../model/orderModel');
const Product = require('../model/productModel');

async function calculateOrderTotal(orderId) {
    const order = await Order.findById(orderId).populate('orderDetails');

    const totalQuantity = order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0);
    const totalPrice = await Promise.all(
        order.orderDetails.map(async (detail) => {
            const product = await Product.findById(detail.productID);
            return product.price * detail.quantity;
        })
    ).then(prices => prices.reduce((sum, price) => sum + price, 0));

    await Order.findByIdAndUpdate(orderId, { quantity: totalQuantity, totalPrice });
}

module.exports = { calculateOrderTotal };
