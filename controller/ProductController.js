const cloudinary = require("../config/cloudinaryConfig");
const Product = require('../model/productModel');
const Material = require('../model/materialModel');
const Gemstone = require('../model/gemstoneModel');
const ProductType = require('../model/productTypeModel');
const Image = require('../model/imageModel');

class ProductController {
    async uploadImage_Api(req, res) {
        try {
            const { name, size, weight, description, price, color, materialID, gemstoneID, productTypeID, quantity } = req.body;

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

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No files uploaded"
                });
            }

            // Create new product
            const newProduct = await Product.create({
                name, size, weight, description, price, color, materialID, gemstoneID, productTypeID, quantity
            });

            // Upload images to Cloudinary and save references
            const imageLinks = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                const newImage = await Image.create({ productID: newProduct._id, imageLink: result.secure_url });
                imageLinks.push(newImage._id);
            }

            // Update product with image links
            newProduct.imageIDs = imageLinks;
            await newProduct.save();

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
            const page = req.query.page ? parseInt(req.query.page) : null;
            const sl = req.query.sl ? parseInt(req.query.sl) : null;
            const searchQuery = req.query.search || '';
    
            let searchCondition = {};
            if (searchQuery) {
                const searchTerms = searchQuery.split(' ').filter(term => term.trim() !== '');
                searchCondition = {
                    name: { $all: searchTerms.map(term => new RegExp(term, 'i')) }
                };
            }
    
            const sortOrder = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
            const sortCondition = sortOrder ? { price: sortOrder } : {};
    
            const totalProducts = await Product.countDocuments(searchCondition);
    
            let products;
            if (page !== null && sl !== null) {
                const skip = (page - 1) * sl;
                products = await Product.find(searchCondition)
                    .populate('materialID')
                    .populate('gemstoneID')
                    .populate({
                        path: 'productTypeID',
                        populate: {
                            path: 'categoryID'
                        }
                    })
                    .populate('imageIDs')
                    .skip(skip)
                    .limit(sl)
                    .sort(sortCondition);
            } else {
                products = await Product.find(searchCondition)
                    .populate('materialID')
                    .populate('gemstoneID')
                    .populate({
                        path: 'productTypeID',
                        populate: {
                            path: 'categoryID'
                        }
                    })
                    .populate('imageIDs')
                    .sort(sortCondition);
            }
    
            return res.status(200).json({
                success: true,
                totalFetched: products.length,
                totalProducts,
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
            const { name, size, weight, description, price, color, materialID, gemstoneID, productTypeID, quantity } = req.body;
    
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
    
            const productType = await ProductType.findById(productTypeID);
            const category = await Category.findById(productType.categoryID);
    
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    name, size, weight, description, price, color, materialID, gemstoneID, productTypeID, categoryID: category._id, quantity
                },
                { new: true }
            ).populate('materialID').populate('gemstoneID').populate('productTypeID').populate('categoryID');
    
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

    async getByID_Api(req, res) {
        try {
            const product = await Product.findById(req.params.id)
                .populate('materialID')
                .populate('gemstoneID')
                .populate({
                    path: 'productTypeID',
                    populate: {
                        path: 'categoryID'
                    }
                })
                .populate('imageIDs');
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product không tồn tại!"
                });
            }
            
            return res.status(200).json({
                success: true,
                product
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

module.exports = new ProductController();
