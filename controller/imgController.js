const cloudinary = require("../config/cloudinaryConfig");
const User = require('../model/productModel');

class ImageController {
    async uploadImage_Api(req, res) {
        try {
            const { name, size, weight, description, price, productType, color, materialName, gemstoneName, productTypes } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }

            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            // Create new user with image link
            const newUser = await User.create({
                name, size, weight, description, price, productType, color, materialName, gemstoneName, productTypes,
                imageLink: result.secure_url
            });

            return res.status(201).json({
                success: true,
                message: "User created successfully",
                user: newUser
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
          const product = await User.find({});
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

module.exports = new ImageController();
