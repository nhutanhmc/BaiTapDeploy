const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Staff = require('../model/staffModel');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Staff.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
