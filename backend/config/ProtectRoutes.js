const { verifyToken } = require('./jwt-utils');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  //console.log(token);
  if (!token){
    return res.status(200).json({ message: "Access denied",isAuthenticated:false });//401
  }

  try {
    const verified = verifyToken(token);
    //console.log(verified);
    req.verified = verified;
    next();
  } catch (error) {
    return res.status(200).json({ message: "Unauthorized",isAuthenticated:false });//400
  }
};


module.exports = { authenticate };
