const passport = require("passport");
const bcrypt = require("bcrypt");
const Members = require("../model/staffModel");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        const user = await Members.findOne({ username: username });

        if (!user) {
          return done(null, false, { error_msg: "Username does not exist!" });
        }
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          //login
          return done(null, user, { success_msg: "Login successfully!" });
        } else {
          return done(null, false, { error_msg: "Wrong password!" });
        }
      } catch (err) {
        return done(null, false, err.message);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Members.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
// const passport = require("passport");
// const Members = require("../model/memberModel");
// const LocalStrategy = require("passport-local").Strategy;

// module.exports = function (passport) {
//   passport.use(
//     new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
//       try {
//         const user = await Members.findOne({ username: username });

//         if (!user) {
//           return done(null, false, { error_msg: "Username does not exist!" });
//         }

//         // Tắt mã hóa ở đây, chỉ để mục đích thử nghiệm
//         if (password === user.password) {
//           // Đăng nhập thành công
//           return done(null, user, { success_msg: "Login successfully!" });
//         } else {
//           return done(null, false, { error_msg: "Wrong password!" });
//         }
//       } catch (err) {
//         return done(null, false, err.message);
//       }
//     })
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user._id);
//   });

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await Members.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   });
// };
