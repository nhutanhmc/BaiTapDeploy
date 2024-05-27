const ProductType = require("../model/productTypeModel");

class productTypeController {
  
  async getProductTypeList_Api(req, res, next) {
    try {
      const productTypes = await ProductType.find({}).populate('categoryID');
      if (productTypes.length > 0) {
        return res.status(200).json({ success: true, productTypes });
      } else {
        return res.status(200).json({ success: false, message: "Không có ProductType nào!" });
      }
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  async getProductTypeById_Api(req, res, next) {
    try {
      const productType = await ProductType.findById(req.params.id).populate('categoryID');
      if (productType) {
        return res.status(200).json({ success: true, productType });
      } else {
        return res.status(404).json({ success: false, message: "ProductType không tồn tại!" });
      }
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  async createProductType_Api(req, res, next) {
    try {
      let newProductName = req.body.name?.trim();
      let newProductDescription = req.body.description?.trim();
      if (!newProductName || newProductName === "") {
        return res.status(400).json({ success: false, message: "Vui lòng nhập name để tạo mới" });
      }
      if (!newProductDescription || newProductDescription === "") {
        return res.status(400).json({ success: false, message: "Vui lòng nhập description để tạo mới" });
      }
      const existingProductType = await ProductType.findOne({ name: newProductName });
      if (existingProductType) {
        return res.status(400).json({ success: false, message: "ProductType này đã tồn tại. Vui lòng nhập name khác!" });
      }
      const newProductType = await ProductType.create(req.body);
      return res.status(201).json({ success: true, newProductType });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  async deleteProductTypeById_Api(req, res, next) {
    try {
      const productType = await ProductType.findById(req.params.id);
      if (!productType) {
        return res.status(404).json({ success: false, message: "ProductType không tồn tại!" });
      }
      const result = await ProductType.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 1) {
        return res.status(200).json({ success: true, message: "Xóa dữ liệu thành công!" });
      } else {
        return res.status(400).json({ success: false, message: "Không có dữ liệu nào được xóa!" });
      }
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  async updateProductTypeById_Api(req, res, next) {
    try {
      let updateProductName = req.body.name?.trim();
      let updateProductDescription = req.body.description?.trim();
      if (!updateProductName) {
        return res.status(400).json({ success: false, message: "Vui lòng không để trống name!" });
      }
      if (!updateProductDescription) {
        return res.status(400).json({ success: false, message: "Vui lòng không để trống description!" });
      }
      const updatedProductType = await ProductType.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('categoryID');
      if (!updatedProductType) {
        return res.status(404).json({ success: false, message: "ProductType không tồn tại!" });
      }
      return res.status(200).json({ success: true, updatedProductType });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }
}

module.exports = new productTypeController();
