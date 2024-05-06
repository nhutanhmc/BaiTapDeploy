const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Members = require("../model/memberModel");
const nodemailer = require("nodemailer");



function generateRandomCode() {
  return Math.floor(Math.random() * 1000000); // Mã số từ 0 đến 999999
}

const code = generateRandomCode();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "anhnhnse161473@fpt.edu.vn",
    pass: "ncxrsxnfivxskybl",
  },
});

// Chức năng để gửi email sau khi đăng nhập thành công
const sendLoginEmail = (user) => {
  const mailOptions = {
    from: "anhnhnse161473@fpt.edu.vn",
    to: user.mail,
    subject: "Đăng nhập thành công",
    text: `Xin chào ${user.username},\n\nBạn đã đăng nhập thành công!\n\nMã số xác thực của bạn là: ${code}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

class memberController {
  loginWithJWT(req, res, next) {
    let { username, password } = req.body;
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
              return res.json("Mật khẩu sai!");
            }
  
            // Tạo payload và mã thông báo (token)
            const payload = { username: user.username };
            const secretKey = "SE161473";
            const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
  
            // Lấy mã code từ cookie
            const storedCode = req.cookies.authCode;
  
            // Kiểm tra xem mã code có tồn tại và thời gian sống còn dưới 10s hay không
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const codeExpiration = 10; // Thời gian sống của mã code là 10s
  
            if (!storedCode || currentTimestamp - storedCode.timestamp > codeExpiration) {
              // Tạo mã code mới nếu không tồn tại hoặc đã hết hạn
              const newCode = generateRandomCode();
              res.cookie("authCode", { code: newCode, timestamp: currentTimestamp });
            } else {
              // Nếu mã code vẫn còn hiệu lực, lấy mã code hiện có từ cookie
              const newCode = storedCode.code;
              res.cookie("authCode", { code: newCode, timestamp: currentTimestamp });
            }
  
            // Lưu token vào cookie
            res.cookie("token", token, { httpOnly: true }); // Lưu token vào cookie và không cho truy cập bằng JavaScript
  
            // Trả về thông báo đăng nhập thành công, mã thông báo, thông tin người dùng
            res.json({
              success: true,
              message: "Đăng nhập thành công!",
              token: token,
              code: storedCode , // Trả về mã code hiện có trong cookie
              user: {
                username: user.username,
                mail: user.mail,
                id: user.id
              }
            });
  
            // Gửi email xác thực với mã code
            sendLoginEmail(user, storedCode ? storedCode.code : "");
          })
          .catch((err) => {
            return res.json(err.message || "Lỗi");
          });
      })
      .catch((err) => {
        return res.json(err.message || "Lỗi");
      });
  }
  

  verifyCode(req, res, next) {
    // Lấy mã code mà người dùng đã nhập từ body của yêu cầu
    const { enteredCode } = req.body;

    // Lấy mã code được lưu trong cookie
    const storedCode = req.cookies.authCode;

    // Kiểm tra mã code được lưu trong cookie có tồn tại hay không
    if (!storedCode) {
      return res.status(400).json({ message: "Không tìm thấy mã xác thực trong cookie." });
    }

    // So sánh mã code mà người dùng nhập với mã code được lưu trong cookie
    if (parseInt(enteredCode, 10) === parseInt(storedCode.code, 10)) {
      // Mã code trùng khớp
      return res.json({ message: "Mã xác thực hợp lệ!" });
    } else {
      // Mã code không trùng khớp
      return res.status(400).json({ message: "Mã xác thực không hợp lệ.", currentCode: storedCode.code, enteredCode: enteredCode });
    }
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
      let { username, password, mail } = req.body;
      // Kiểm tra xem đã nhập username và password chưa
      if (!username || !password || !mail) {
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
      const newUser = await Members.create({ username, password: hashedPassword, mail });

      // Trả về thông báo thành công và thông tin của thành viên mới
      return res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (err) {
      // Xử lý lỗi nếu có
      return res.status(500).json(err.message || "Lỗi chưa xác định!");
    }
  }
}
module.exports = new memberController();
