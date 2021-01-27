const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        let newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            let acc = await User.findOne({ email: newUser.email });
            if (acc) {
              done(null, false);
            } else {
              user = await User.create(newUser);
              done(null, user);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, donw) => [
      User.findOne({ email: email }).then((user) => {
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            done(null, false);
          }
        });
      }),
    ])
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
