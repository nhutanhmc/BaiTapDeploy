const Material = require("../model/materialModel");

class materialController {
  getMaterialsList_Api(req, res, next) {
    try {
      return new Promise((resolve, reject) => {
        Material.find({}).then((materials) => {
          if (materials.length > 0) {
            return resolve(res.status(200).json({ success: true, materials }));
          } else {
            return resolve(res.status(200).json({ success: false, message: "Không có material nào!" }));
          }
        });
      }).catch((err) => {
        return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
      });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  getMaterialById_Api(req, res, next) {
    try {
      Material.findById({ _id: req.params.id })
        .then((material) => {
          if (material) {
            return res.status(200).json({ success: true, material });
          } else {
            return res.json({ success: false, message: "Material không tồn tại!" });
          }
        })
        .catch((err) => {
          return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
        });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  createMaterial_Api(req, res, next) {
    try {
      let newName = req.body.name?.trim();
      let newWeight = req.body.weight;
      let newSize = req.body.size?.trim();
      if (!newName || newName === "") {
        return res.json({ success: false, message: "Vui lòng nhập name để tạo mới" });
      }
      if (!newWeight || newWeight === "") {
        return res.json({ success: false, message: "Vui lòng nhập weight để tạo mới" });
      }
      if (!newSize || newSize === "") {
        return res.json({ success: false, message: "Vui lòng nhập size để tạo mới" });
      }
      Material.findOne({ name: newName })
        .then((materials) => {
          if (materials) {
            return res.json({ success: false, message: "Material này đã tồn tại. Vui lòng nhập name khác!" });
          }
          Material.create({ name: newName, weight: newWeight, size: newSize })
            .then((result) => {
              return res.status(201).json({ success: true, result });
            })
            .catch((err) => {
              return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
            });
        })
        .catch((err) => {
          return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
        });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  deleteMaterialById_Api(req, res, next) {
    try {
      Material.findById({ _id: req.params.id })
        .then((materials) => {
          if (!materials) {
            return res.json({ success: false, message: "Material không tồn tại!" });
          }
          Material.deleteOne({ _id: req.params.id })
            .then((result) => {
              if (result.deletedCount === 1) {
                return res.status(200).json({ success: true, message: "Xóa dữ liệu thành công!" });
              } else {
                return res.json({ success: false, message: "Không có dữ liệu nào được xóa!" });
              }
            })
            .catch((err) => {
              return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
            });
        })
        .catch((err) => {
          return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
        });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

  updateMaterialById_Api(req, res, next) {
    try {
      let updateName = req.body.name?.trim();
      let updateWeight = req.body.weight;
      let updateSize = req.body.size?.trim();
      if (!updateName) {
        return res.json({ success: false, message: "Vui lòng không để trống name!" });
      }
      if (!updateWeight) {
        return res.json({ success: false, message: "Vui lòng không để trống weight!" });
      }
      if (!updateSize) {
        return res.json({ success: false, message: "Vui lòng không để trống size!" });
      }
      Material.findByIdAndUpdate(req.params.id, { name: updateName, weight: updateWeight, size: updateSize }, { new: true })
        .then((material) => {
          if (!material) {
            return res.json({ success: false, message: "Material không tồn tại!" });
          }
          return res.json({ success: true, material });
        })
        .catch((err) => {
          return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
        });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }
}

module.exports = new materialController();
