const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email}, process.env.TOKEN_SECRET, { expiresIn: '60d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

module.exports = { generateToken, verifyToken };
