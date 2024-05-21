const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        
            name: { type: String, required: true },
            img: { type: String },
            size: { type: String },
            weight: { type: Number },
            description: { type: String },
            price: { type: Number },
            productType: { type: String },
            color: { type: String },
            materialName: { type: String, ref: 'Material' },
            gemstoneName: { type: String, ref: 'Gemstone' },
            productTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductType' }],
            gemstones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone' }],
            materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
            orderDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderDetail' }]
        
    }
)

const Product = mongoose.model("Product", ProductSchema)
module.exports = Product