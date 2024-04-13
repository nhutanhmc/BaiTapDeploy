const jwt = require("jsonwebtoken");

module.exports = {
  authenticateToken: function (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res.status(401).json({ error: "Vui lòng đăng nhập với token!" });
    }

    jwt.verify(token, "SE161473", (err, user) => {
      if (err) {
        return res.status(403).json(err.message);
      }
      req.user = user;
      next();
    });
  },
};
