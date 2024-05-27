const cloudinary = require("../config/cloudinaryConfig");
const Product = require('../model/productModel');
const Material = require('../model/materialModel');
const Gemstone = require('../model/gemstoneModel');
const ProductType = require('../model/productTypeModel');

class ImageController {
    async uploadImage_Api(req, res) {
        try {
            const { name, size, weight, description, price, color, materialID, gemstoneID, productTypeID } = req.body;

            // Kiểm tra các ID liên quan
            if (!await Material.findById(materialID)) {
                return res.status(400).json({
                    success: false,
                    message: "Material không tồn tại!"
                });
            }
            if (!await Gemstone.findById(gemstoneID)) {
                return res.status(400).json({
                    success: false,
                    message: "Gemstone không tồn tại!"
                });
            }
            if (!await ProductType.findById(productTypeID)) {
                return res.status(400).json({
                    success: false,
                    message: "ProductType không tồn tại!"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }

            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            // Create new product with image link
            const newProduct = await Product.create({
                name, size, weight, description, price, color, materialID, gemstoneID, productTypeID,
                imageLink: result.secure_url
            });

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                product: newProduct
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message || "Unknown error"
            });
        }
    }

    async getAllProduct_Api(req, res) {
        try {
            const products = await Product.find({})
                .populate('materialID')
                .populate('gemstoneID')
                .populate('productTypeID');

            return res.status(200).json({
                success: true,
                products
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message || "Unknown error"
            });
        }
    }

    async deleteProduct_Api(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product không tồn tại!"
                });
            }

            // Delete product
            await Product.deleteOne({ _id: req.params.id });

            return res.status(200).json({
                success: true,
                message: "Product deleted successfully"
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message || "Unknown error"
            });
        }
    }

    async updateProduct_Api(req, res) {
        try {
            const { name, size, weight, description, price, color, materialID, gemstoneID, productTypeID } = req.body;

            // Kiểm tra các ID liên quan
            if (materialID && !await Material.findById(materialID)) {
                return res.status(400).json({
                    success: false,
                    message: "Material không tồn tại!"
                });
            }
            if (gemstoneID && !await Gemstone.findById(gemstoneID)) {
                return res.status(400).json({
                    success: false,
                    message: "Gemstone không tồn tại!"
                });
            }
            if (productTypeID && !await ProductType.findById(productTypeID)) {
                return res.status(400).json({
                    success: false,
                    message: "ProductType không tồn tại!"
                });
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    name, size, weight, description, price, color, materialID, gemstoneID, productTypeID
                },
                { new: true }
            ).populate('materialID')
             .populate('gemstoneID')
             .populate('productTypeID');

            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product không tồn tại!"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
                product: updatedProduct
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message || "Unknown error"
            });
        }
    }
}

module.exports = new ImageController();
