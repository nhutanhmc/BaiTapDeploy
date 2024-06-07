// passportConfig.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Staff = require('../model/staffModel'); // Đường dẫn đến model Staff

passport.use(
  new GoogleStrategy(
    {
      clientID: "484778063646-2pi0ic1a415eav8j68pb1925om9vqnc4.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/staffsRouter/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Staff.findOne({ googleId: profile.id });
        if (!user) {
          user = await Staff.create({
            googleId: profile.id,
            name: profile.displayName,
            role: 'staff',
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Các phương thức serializeUser và deserializeUser (nếu cần)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Staff.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
