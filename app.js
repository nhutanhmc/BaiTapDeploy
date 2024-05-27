// Nhập các thư viện cần thiết
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

// Nhập tệp định tuyến

const staffsRouter = require("./routes/staffsRouter");
const productTypeRouter = require("./routes/productTypeRouter");
const gemstoneRouter = require("./routes/gemstoneRouter");
const materialRouter = require("./routes/materialRouter");
const imageRouter = require("./routes/imageRouter");
const categoryRouter = require("./routes/categoryRouter");

const app = express();
app.use(cors());
// Nhập thư viện dotenv và cấu hình các biến môi trường
const dotenv = require("dotenv");
dotenv.config();

// Cấu hình ứng dụng Express
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Cấu hình passport
require("./config/passport")(passport);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Sử dụng các biến môi trường để kết nối với cơ sở dữ liệuw MongoDB
const url = `${process.env.DATABASE_TYPE}${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_SERVER}/${process.env.DATABASE_NAME}`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });

// Cấu hình ứng dụng
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Định nghĩa biến `user` trong `locals` cho các view
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

// Thiết lập định tuyến cho các phần khác nhau của ứng dụng
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/staffsRouter", staffsRouter);
app.use("/producttype", productTypeRouter);
app.use("/gemstone", gemstoneRouter);
app.use("/material", materialRouter);
app.use("/images", imageRouter);
app.use("/category", categoryRouter);

app.use("/errorPage", (req, res) => {
  res.render("error/index");
});

// Chuyển hướng trang chủ tới trang đăng nhập nếu chưa đăng nhập
app.use((req, res, next) => {
  if (req.originalUrl === "/") {
    return res.redirect("/members/login");
  }
  next();
});

// Xử lý các lỗi 404 và chuyển tiếp tới trình xử lý lỗi
app.use(function (req, res, next) {
  next(createError(404));
});

// Trình xử lý lỗi
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Hiển thị trang lỗi và chuyển hướng đến trang lỗi nếu có lỗi
  res.status(err.status || 500);
  req.flash("error", err.message);
  res.redirect("/errorPage");
});

// Xuất ứng dụng
module.exports = app;
