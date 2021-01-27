const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["token"];
  console.log(req.body);
  if (!token) return res.status(401).json({ message: "Access Denied!" });
  try {
    const decoded = jwt.verify(token, process.env.PASSWORD_HASH);
    req.userData = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token!" });
  }
};
