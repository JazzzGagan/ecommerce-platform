const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/constants");

const getTokenFromRequest = (req) => {
  // Check cookie first
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  // Check Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkAuth = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    req.authUser = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

const checkAuthAdmin = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    if (!user.roles || !user.roles.includes("Admin")) {
      return res
        .status(403)
        .json({ message: "Unauthorized access: Admin only" });
    }
    req.authUser = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = {
  checkAuth,
  checkAuthAdmin,
};
