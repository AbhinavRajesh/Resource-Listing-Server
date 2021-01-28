const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

exports.signup = async (req, res) => {
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  if (req.body.password === req.body.cpassword) {
    let newUser = new User({
      displayName: req.body.displayName,
      image: req.body.image,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) return res.send({ error: "User with given email id exists!" });
      else {
        newUser
          .save()
          .then((result) => console.log(result))
          .catch((err) => console.log(`ERROR : ${err}`));
        const token = jwt.sign({ user: newUser }, process.env.PASSWORD_HASH);
        return res.status(200).send({ token: token });
      }
    });
  } else {
    res.send({ Error: "Password do not match" });
  }
};

exports.login = async (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      console.log(user);
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          console.log(result);
          console.log(`ERROR: ${err}`);
          return res.status(200).send({ error: "Authentication failed" });
        }
        if (result) {
          const token = jwt.sign({ user: user }, process.env.PASSWORD_HASH);
          return res.status(200).send({ token: token });
        }
      });
    } else return res.status(200).json({ error: "Authentication failed" });
  });
};

exports.authSuccess = (req, res) => {
  const token = jwt.sign({ user: req.user }, process.env.PASSWORD_HASH);
  res.redirect(`http://localhost:3000/auth?token=${token}`);
};

exports.currentUser = (req, res, next) => {
  const token = req.headers["token"];
  if (!token) return res.status(401).json({ message: "Access Denied!" });
  try {
    const decoded = jwt.verify(token, process.env.PASSWORD_HASH);
    req.userData = decoded;
    console.log(decoded);
    res.status(200).json({ user: req.userData });
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token!" });
  }
};

exports.logout = (req, res) => {
  req.logout();
  return res.status(200).send({ message: "Logout Successful" });
};
