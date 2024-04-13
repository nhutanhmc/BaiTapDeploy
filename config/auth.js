module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Vui lòng đăng nhập!");
    res.status(401).redirect("/members/login");
  },
};
