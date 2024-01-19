// authLogout.js
const jwt = require("jsonwebtoken");

const authLogout = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, "sankat-nivaaran");

      if (decoded) {
        req.body.email = decoded.email;
        req.body.driverId = decoded.driverId;
        next();
      } else {
        res.status(200).json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(400).json({ message: "Unauthorized: Invalid token" });
    }
  } else {
  }
};

module.exports = {
  authLogout,
};
