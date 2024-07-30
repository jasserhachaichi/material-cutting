const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email,role: user.role ,imageUrl:user.imageUrl, image:user.image? "http://localhost:4000/api/image/profile/" + user.image: null        ,firstName: user.firstName, lastName:user.lastName }, process.env.TOKEN_SECRET, { expiresIn: '60d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

module.exports = { generateToken, verifyToken };
