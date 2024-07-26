const { verifyToken } = require('./jwt-utils');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access denied",isAuthenticated:false });//401

  try {
    const verified = verifyToken(token);
    req.client = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Unauthorized",isAuthenticated:false });//400
  }
};

module.exports = { authenticate };
