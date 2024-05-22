const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Members = require("../model/memberModel");

class memberController {
  loginWithJWT(req, res, next) {
    let { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) {
      return res.json("Vui lòng nhập đủ thông tin đăng nhập!");
    }
    Members.findOne({ username: username })
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
  

  getLoginPage(req, res, next) {
    res.render("login/index");
  }

  login(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (!user) {
        req.flash(Object.keys(info), Object.values(info));
        res.redirect("/members/login");
        return;
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/sections");
      });
    })(req, res, next);
  }

  logout(req, res, next) {
    req.logout(() => {
      req.flash("success_msg", "You are logged out!");
      res.redirect("/members/login");
    });
  }

  async signUp(req, res, next) {
    try {
      let { username, password } = req.body;
      // Kiểm tra xem đã nhập username và password chưa
      if (!username || !password) {
        return res.json("Vui lòng nhập đủ thông tin đăng ký!");
      }

      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = await Members.findOne({ username });
      if (existingUser) {
        return res.json("Username đã tồn tại. Vui lòng chọn username khác!");
      }

      // Mã hóa password trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo thành viên mới trong cơ sở dữ liệu
      const newUser = await Members.create({ username, password: hashedPassword });

      // Trả về thông báo thành công và thông tin của thành viên mới
      return res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (err) {
      // Xử lý lỗi nếu có
      return res.status(500).json(err.message || "Lỗi chưa xác định!");
    }
  }
}
module.exports = new memberController();
