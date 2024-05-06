const Car = require("../model/carsModel");

class CarsController {
    getCarsList_Api(req, res, next) {
        Car.find({})
          .then((cars) => {
            if (cars.length > 0) {
              return res.status(200).json(cars);
            } else {
              return res.status(200).json("Không có xe nào!");
            }
          })
          .catch((err) => {
            return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
          });
      }
      

  getCarById_Api(req, res, next) {
    try {
      Car.findById({ _id: req.params.id })
        .then((car) => {
          if (car) {
            return res.status(200).json(car);
          } else {
            return res.json("Xe không tồn tại!");
          }
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }

  createCar_Api(req, res, next) {
    try {
      let newName = req.body.name?.trim();
      let newType = req.body.type?.trim();
      let newImg = req.body.img?.trim();
      let newCost = req.body.cost;
      let newInfor = req.body.infor?.trim();
      if (!newName || newName === "") {
        return res.json("Vui lòng nhập tên xe để tạo mới");
      }
      if (!newType || newType === "") {
        return res.json("Vui lòng nhập loại xe để tạo mới");
      }
      if (!newImg || newImg === "") {
        return res.json("Vui lòng nhập ảnh xe để tạo mới");
      }
      if (!newCost || isNaN(newCost)) {
        return res.json("Vui lòng nhập giá xe hợp lệ để tạo mới");
      }
      if (!newInfor || newInfor === "") {
        return res.json("Vui lòng nhập thông tin xe để tạo mới");
      }
      Car.findOne({ name: newName })
        .then((car) => {
          if (car) {
            return res.json("Xe này đã tồn tại. Vui lòng nhập tên xe khác!");
          }
          Car.create({ name: newName, type: newType, img: newImg, cost: newCost, infor: newInfor })
            .then((result) => {
              return res.status(201).json(result);
            })
            .catch((err) => {
              return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
            });
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }

  deleteCarById_Api(req, res, next) {
    try {
      Car.findById({ _id: req.params.id })
        .then((car) => {
          if (!car) {
            return res.json("Xe không tồn tại!");
          }
          Car.deleteOne({ _id: req.params.id })
            .then((result) => {
              if (result.deletedCount === 1) {
                return res.status(200).json("Xóa dữ liệu thành công!");
              } else {
                return res.json("Không có dữ liệu nào được xóa!");
              }
            })
            .catch((err) => {
              return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
            });
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }
  
  updateCarById_Api(req, res, next) {
    try {
      let updateName = req.body.name?.trim();
      let updateType = req.body.type?.trim();
      let updateImg = req.body.img?.trim();
      let updateCost = req.body.cost;
      let updateInfor = req.body.infor?.trim();
      if (!updateName) {
        return res.json("Vui lòng không để trống tên xe!");
      }
      if (!updateType) {
        return res.json("Vui lòng không để trống loại xe!");
      }
      if (!updateImg) {
        return res.json("Vui lòng không để trống ảnh xe!");
      }
      if (!updateCost || isNaN(updateCost)) {
        return res.json("Vui lòng nhập giá xe hợp lệ!");
      }
      if (!updateInfor) {
        return res.json("Vui lòng không để trống thông tin xe!");
      }
      Car.findByIdAndUpdate(req.params.id, { name: updateName, type: updateType, img: updateImg, cost: updateCost, infor: updateInfor }, { new: true })
        .then((car) => {
          if (!car) {
            return res.json("Xe không tồn tại!");
          }
          return res.json(car);
        })
        .catch((err) => {
          return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res.status(err.status || 500).json(err.message || "Lỗi chưa xác định!");
    }
  }
}
module.exports = new CarsController();
