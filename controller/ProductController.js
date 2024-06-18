const cloudinary = require("../config/cloudinaryConfig");
const Product = require('../model/productModel');
const Material = require('../model/materialModel');
const Gemstone = require('../model/gemstoneModel');
const ProductType = require('../model/productTypeModel');
const Image = require('../model/imageModel');

class ProductController {
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

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No files uploaded"
                });
            }

            // Create new product
            const newProduct = await Product.create({
                name, size, weight, description, price, color, materialID, gemstoneID, productTypeID
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
            // Lấy giá trị page và sl từ query parameters, nếu không có thì mặc định là 1 và 5
            const page = parseInt(req.query.page) || 1;
            const sl = parseInt(req.query.sl) || 5;
    
            // Lấy giá trị search từ query parameters, nếu có
            const searchQuery = req.query.search || '';
    
            // Tính toán số lượng tài liệu cần bỏ qua
            const skip = (page - 1) * sl;
    
            // Tạo điều kiện tìm kiếm
            let searchCondition = {};
            if (searchQuery) {
                const searchTerms = searchQuery.split(' ').filter(term => term.trim() !== '');
                searchCondition = {
                    name: { $all: searchTerms.map(term => new RegExp(term, 'i')) }
                };
            }
    
            // Lấy giá trị sort từ query parameters, nếu có
            const sortOrder = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
            const sortCondition = sortOrder ? { price: sortOrder } : {};
    
            // Đếm tổng số sản phẩm hiện có trong cơ sở dữ liệu phù hợp với điều kiện tìm kiếm
            const totalProducts = await Product.countDocuments(searchCondition);
    
            // Lấy danh sách sản phẩm theo phân trang và điều kiện tìm kiếm
            const products = await Product.find(searchCondition)
                .populate('materialID')
                .populate('gemstoneID')
                .populate({
                    path: 'productTypeID',
                    populate: {
                        path: 'categoryID' // Populate categoryID for productTypeID
                    }
                })
                .populate('imageIDs') // Populate imageIDs to get image details
                .skip(skip)
                .limit(sl)
                .sort(sortCondition); // Sắp xếp theo giá
    
            return res.status(200).json({
                success: true,
                totalFetched: products.length, // Tổng số lượng sản phẩm được lấy ra
                totalProducts, // Tổng số lượng sản phẩm hiện tại
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
    
            const productType = await ProductType.findById(productTypeID);
            const category = await Category.findById(productType.categoryID);
    
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    name, size, weight, description, price, color, materialID, gemstoneID, productTypeID, categoryID: category._id
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
}

module.exports = new ProductController();
