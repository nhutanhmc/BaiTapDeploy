const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Staff = require("../model/staffModel");

class staffController {
  loginWithJWT(req, res, next) {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.json({ success: false, message: "Vui lòng nhập đủ thông tin đăng nhập!" });
    }
    Staff.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return res.json({ success: false, message: "Username không tồn tại" });
        }
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (!result) {
              return res.json({ success: false, message: "Sai mật khẩu!" });
            }
            // Tạo mới token mỗi khi đăng nhập thành công
            console.log(`User role: ${user.role}`);
            const payload = { username: user.username, role: user.role };
            const secretKey = "SE161473";
            const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
            res.cookie("token", token);
            return res.json({ success: true, message: "Đăng nhập thành công!", token: token, role: user.role });
          })
          .catch((err) => {
            return res.json({ success: false, message: err.message || "Lỗi" });
          });
      })
      .catch((err) => {
        return res.json({ success: false, message: err.message || "Lỗi" });
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
        return res.json({ success: false, message: "Vui lòng nhập đủ thông tin đăng ký!" });
      }

      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = await Staff.findOne({ username });
      if (existingUser) {
        return res.json({ success: false, message: "Username đã tồn tại. Vui lòng chọn username khác!" });
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

  
      return res.status(201).json({ success: true, message: "Đăng ký thành công!", user: newUser });
    } catch (err) {

      return res.status(500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }

 
  async getAllUsers(req, res, next) {
    try {
      const users = await Staff.find({});
      return res.status(200).json({ success: true, users: users });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || "Lỗi chưa xác định!" });
    }
  }
}

module.exports = new staffController();
