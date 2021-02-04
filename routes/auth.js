const router = require("express").Router();
const passport = require("passport");

const {
  authSuccess,
  currentUser,
  logout,
  signup,
  login,
} = require("../controllers/auth");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/email",
  passport.authenticate("local", { failureRedirect: "/google" }),
  (req, res) => {
    res.redirect("/auth/success");
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `https://resourcelisting.netlify.app/auth?error=Try Email and Password Signin with that account`,
  }),
  (req, res) => {
    res.redirect("/auth/success");
  }
);

router.get("/success", authSuccess);
router.get("/user", currentUser);
router.get("/logout", logout);

router.post("/email/signup", signup);
router.post("/email/login", login);
module.exports = router;
