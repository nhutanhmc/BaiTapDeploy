const Customer = require("../model/customerModel");

class customerController {
  getCustomerList_Api(req, res, next) {
    try {
      // console.log("kiet")
      return new Promise((resolve, reject) => {
        Customer.find({}).then((customer) => {
          if (customer.length > 0) {
            return resolve(res.status(200).json(customer));
          } else {
            return resolve(res.status(200).json("Không có Customer nào!"));
          }
        });
      }).catch((err) => {
        return res
          .status(err.status || 500)
          .json(err.message || "Lỗi chưa xác định!");
      });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json(err.message || "Lỗi chưa xác định!");
    }
  }
  getCustomerById_Api(req, res, next) {
    try {
      Customer.findById({ _id: req.params.id })
        .then((customer) => {
          if (customer) {
            return res.status(200).json(customer);
          } else {
            return res.json("Customer không tồn tại!");
          }
        })
        .catch((err) => {
          return res
            .status(err.status || 500)
            .json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json(err.message || "Lỗi chưa xác định!");
    }
  }

  createCustomerById_Api(req, res, next) {
    try {
      let newNamecustomer = req.body.name?.trim();
      let newAge = req.body.age;
      let newPhone = req.body.phone;
      let newAddress = req.body.address?.trim();
      if (!newNamecustomer || newNamecustomer === "") {
        return res.json("Vui lòng nhập name để tạo mới");
      }
      if (!newAge || newAge === "") {
        return res.json("Vui lòng nhập Age để tạo mới");
      }
      if (!newPhone || newPhone === "") {
        return res.json("Vui lòng nhập Phone");
      }
      if (!newAddress || newAddress === "") {
        return res.json("Vui lòng nhập Address");
      }

      Customer.findOne({ name: newNamecustomer })
        .then((customer) => {
          if (customer) {
            return res.json("Nguoi dung nay da ton tai.");
          }
          Customer.create({
            name: newNamecustomer,
            age: newAge,
            phone: newPhone,
            address: newAddress,
          })
            .then((result) => {
              return res.status(201).json(result);
            })
            .catch((err) => {
              return res
                .status(err.status || 500)
                .json(err.message || "Lỗi chưa xác định!");
            });
        })
        .catch((err) => {
          return res
            .status(err.status || 500)
            .json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json(err.message || "Lỗi chưa xác định!");
    }
  }

  updateCustomerById_Api(req, res, next) {
    try {
      let updateNamecustomer = req.body.name?.trim();
      let updateAge = req.body.age;
      let updatePhone = req.body.phone.trim();
      let updateAddress = req.body.address;

      if (!updateNamecustomer) {
        return res.json("Vui long nhap name!");
      }
      if (!updateAge) {
        return res.json("Vui lòng không để trống Age!");
      }
      if (!updatePhone) {
        return res.json("Vui lòng không để trống Phone!");
      }
      if (!updateAddress) {
        return res.json("Vui lòng không để trống Address!");
      }

      Customer.findByIdAndUpdate(
        req.params.id,
        {
          name: updateNamecustomer,
          age: updateAge,
          phone: updatePhone,
          address: updateAddress,
        },
        { new: true }
      )
        .then((customer) => {
          if (!customer) {
            return res.json("Customer khong ton tai");
          }
          return res.json(customer);
        })
        .catch((err) => {
          return res
            .status(err.status || 500)
            .json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json(err.message || "Lỗi chưa xác định!");
    }
  }
  deleteCustomerById_Api(req, res, next) {
    try {
      Customer.findById({ _id: req.params.id })
        .then((customers) => {
          if (!customers) {
            return res.json("Customer không tồn tại!");
          }
          Customer.deleteOne({ _id: req.params.id })
            .then((result) => {
              if (result.deletedCount === 1) {
                return res.status(200).json("Xóa dữ liệu thành công!");
              } else {
                return res.json("Không có dữ liệu nào được xóa!");
              }
            })
            .catch((err) => {
              return res
                .status(err.status || 500)
                .json(err.message || "Lỗi chưa xác định!");
            });
        })
        .catch((err) => {
          return res
            .status(err.status || 500)
            .json(err.message || "Lỗi chưa xác định!");
        });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json(err.message || "Lỗi chưa xác định!");
    }
  }
}

module.exports = new customerController();
