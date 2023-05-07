require('dotenv').config()
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = 'Anonymous';
    return next();
  }
  const [bearer, token] = authHeader.split(' ');


/*
  if (!authHeader) {
    const error = new Error('Authorization header not present');
    error.statusCode = 401;
    return next(error);
  }

  if (!token || !bearer) {
    const error = new Error('Malformed Authorization header');
    error.statusCode = 401;
    return next(error);
  }

  if (bearer !== 'Bearer') {
    const error = new Error('Invalid Authorization header format');
    error.statusCode = 401;
    return next(error);
  }
*/
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    console.log(req.user)
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};
