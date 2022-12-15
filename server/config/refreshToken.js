const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  return token;
};

module.exports = generateRefreshToken;
