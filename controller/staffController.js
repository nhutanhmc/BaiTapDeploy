const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Staff = require("../model/staffModel");

class staffController {
  loginWithJWT(req, res, next) {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.json("Vui lòng nhập đủ thông tin đăng nhập!");
    }
    Staff.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return res.json("Username không tồn tại");
        }
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (!result) {
              return res.json("Sai mật khẩu!");
            }
            // Kiểm tra xem có token trong cookie không
            if (req.cookies.token) {
              // Giải mã token để kiểm tra tính hợp lệ
              jwt.verify(req.cookies.token, "SE161473", (err, decoded) => {
                if (err) {
                  // Token hết hạn hoặc không hợp lệ, tạo mới token
                  const payload = { username: user.username };
                  const secretKey = "SE161473";
                  const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
                  res.cookie("token", token);
                  return res.json({ message: "Đăng nhập thành công!", token: token });
                } else {
                  // Token hợp lệ, không cần tạo mới
                  return res.json({ message: "Đăng nhập thành công!", token: req.cookies.token });
                }
              });
            } else {
              // Không có token trong cookie, tạo mới token
              const payload = { username: user.username };
              const secretKey = "SE161473";
              const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
              res.cookie("token", token);
              return res.json({ message: "Đăng nhập thành công!", token: token });
            }
          })
          .catch((err) => {
            return res.json(err.message || "Lỗi");
          });
      })
      .catch((err) => {
        return res.json(err.message || "Lỗi");
      });
  }

  logout(req, res, next) {
    req.logout(() => {
      req.flash("success_msg", "You are logged out!");
      res.redirect("/staff/login");
    });
  }

  async signUp(req, res, next) {
    try {
      let { username, password, name, age, role } = req.body;
      // Kiểm tra xem đã nhập đầy đủ thông tin chưa
      if (!username || !password || !name || !role) {
        return res.json("Vui lòng nhập đủ thông tin đăng ký!");
      }

      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = await Staff.findOne({ username });
      if (existingUser) {
        return res.json("Username đã tồn tại. Vui lòng chọn username khác!");
      }

      // Mã hóa password trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo nhân viên mới trong cơ sở dữ liệu
      const newUser = await Staff.create({
        username,
        password: hashedPassword,
        name,
        age,
        role
      });

      // Trả về thông báo thành công và thông tin của nhân viên mới
      return res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (err) {
      // Xử lý lỗi nếu có
      return res.status(500).json(err.message || "Lỗi chưa xác định!");
    }
  }

  // Thêm phương thức getAllUsers
  async getAllUsers(req, res, next) {
    try {
      const users = await Staff.find({});
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json(err.message || "Lỗi chưa xác định!");
    }
  }
}

module.exports = new staffController();
