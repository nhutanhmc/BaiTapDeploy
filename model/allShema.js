const mongoose = require('mongoose');

const ProductTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String },
    weight: { type: Number },
    description: { type: String },
    price: { type: Number },
    productType: { type: String },
    color: { type: String },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    gemstone: { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone' }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String },
    weight: { type: Number },
    description: { type: String },
    price: { type: Number },
    productType: { type: String },
    color: { type: String },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    gemstone: { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone' },
    productTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductType' }]
});

const ProductCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const GemstoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: Number },
    size: { type: String }
});

const MaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String },
    weight: { type: Number }
});

const OrderDetailSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
    totalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    orderDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetail' }],
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
});

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    phone: { type: String },
    address: { type: String },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const PaymentSchema = new mongoose.Schema({
    cash: { type: Number },
    bank: { type: String }
});

const StoreSchema = new mongoose.Schema({
    currentQuantity: { type: Number, required: true },
    phone: { type: String },
    location: { type: String },
    lastUpdateInven: { type: Date, default: Date.now },
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }]
});

const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, required: true}
});

// Create the models
const ProductType = mongoose.model('ProductType', ProductTypeSchema);
const Product = mongoose.model('Product', ProductSchema);
const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);
const Gemstone = mongoose.model('Gemstone', GemstoneSchema);
const Material = mongoose.model('Material', MaterialSchema);
const OrderDetail = mongoose.model('OrderDetail', OrderDetailSchema);
const Order = mongoose.model('Order', OrderSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Payment = mongoose.model('Payment', PaymentSchema);
const Store = mongoose.model('Store', StoreSchema);
const Staff = mongoose.model('Staff', StaffSchema);

// Export the models
module.exports = {
    ProductType,
    Product,
    ProductCategory,
    Gemstone,
    Material,
    OrderDetail,
    Order,
    Customer,
    Payment,
    Store,
    Staff
};