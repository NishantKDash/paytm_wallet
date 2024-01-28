const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(403).json({ message: "Unauthorized access" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { authMiddleware };
